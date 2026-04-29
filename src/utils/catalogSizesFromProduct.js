import { staticCategories } from "../data/staticCategoryCatalog";

function sizesFromOption(opt) {
  if (!opt) return null;
  if (Array.isArray(opt.sizes) && opt.sizes.length) return opt.sizes.map(String);
  if (Array.isArray(opt.jars) && opt.jars.length) return opt.jars.map(String);
  if (Array.isArray(opt.burners) && opt.burners.length) return opt.burners.map(String);
  return null;
}

export function collectProductSkus(product) {
  const out = new Set();
  const add = (v) => {
    if (v == null) return;
    const s = String(v).trim();
    if (s && /[A-Za-z]/.test(s)) out.add(s);
  };
  add(product.product_id);
  add(product.sku);
  add(product.model_number);
  if (Array.isArray(product.variants)) {
    for (const v of product.variants) {
      add(v.sku);
      add(v.product_id);
    }
  }
  return [...out];
}

function normSku(s) {
  return String(s).toUpperCase().replace(/\s+/g, "");
}

/** Stronger matches score higher (exact > long shared prefix). */
function skuMatchScore(candidateRaw, catalogSkuRaw) {
  const c = normSku(candidateRaw);
  const cs = normSku(catalogSkuRaw);
  if (!c || !cs || cs.length < 2) return 0;
  if (c === cs) return 1000 + cs.length;
  if (c.length >= 4 && c.startsWith(cs)) return 500 + cs.length;
  if (cs.length >= 4 && cs.startsWith(c)) return 400 + c.length;
  const c0 = c.split("-")[0];
  const cs0 = cs.split("-")[0];
  if (c0.length >= 4 && cs0.length >= 4 && c0 === cs0) return 300 + c0.length;
  return 0;
}

function matchBySku(product, catalog) {
  const candidates = collectProductSkus(product);
  let best = 0;
  let bestSizes = null;
  for (const main of catalog) {
    for (const sub of main.sub_categories || []) {
      for (const ser of sub.series || []) {
        for (const opt of ser.options || []) {
          if (!opt.skus?.length) continue;
          for (const catSku of opt.skus) {
            for (const cand of candidates) {
              const sc = skuMatchScore(cand, catSku);
              if (sc > best) {
                const sz = sizesFromOption(opt);
                if (sz?.length) {
                  best = sc;
                  bestSizes = sz;
                }
              }
            }
          }
        }
      }
    }
  }
  return best > 0 ? bestSizes : null;
}

export function isInnerLidProduct(product) {
  const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || "";
  const productName = product.name || product.product_name || product.title || "";
  const lidTypeStr = String(lidType).toLowerCase();
  const productNameStr = String(productName).toLowerCase();
  return (
    lidTypeStr.includes("innerlid") ||
    lidTypeStr.includes("inner lid") ||
    lidTypeStr.includes("inner-lid") ||
    productNameStr.includes("innerlid") ||
    productNameStr.includes("inner lid") ||
    productNameStr.includes("inner-lid")
  );
}

export function isOuterLidProduct(product) {
  const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || "";
  const productName = product.name || product.product_name || product.title || "";
  const lidTypeStr = String(lidType).toLowerCase();
  const productNameStr = String(productName).toLowerCase();
  return (
    lidTypeStr.includes("outerlid") ||
    lidTypeStr.includes("outer lid") ||
    lidTypeStr.includes("outer-lid") ||
    productNameStr.includes("outerlid") ||
    productNameStr.includes("outer lid") ||
    productNameStr.includes("outer-lid")
  );
}

function combinedHaystack(product) {
  const name = (product.product_name || product.name || "").toLowerCase();
  const mat = (product.material_name || product.material || product.series || "").toLowerCase();
  return `${name} ${mat}`;
}

const PC_LINE_ORDER = ["Supreme", "Ultimate", "Heavy", "Desire", "Elite", "Fine", "Prime", "Blacko"];

function pickPressureSeries(sub, h, innerBranch) {
  if (innerBranch) {
    if (/hard\s*anod|anodized|blacko/i.test(h)) {
      return sub.series.find((s) => /hard-anodized/i.test(s.id)) || null;
    }
    if (/triply|tri-ply|tri ply/i.test(h)) {
      return sub.series.find((s) => /triply/i.test(s.id)) || null;
    }
    if ((/stainless|\bss\b|steel/.test(h) && !/non-stick|non stick/.test(h)) || /\bdesire\b|\belite\b/i.test(h)) {
      const s = sub.series.find((x) => /stainless-steel/.test(x.id) && !/triply/.test(x.id));
      if (s) return s;
    }
    return sub.series.find((s) => s.id === "aluminium") || sub.series[0];
  }
  if (/triply|tri-ply|tri ply/i.test(h)) {
    return sub.series.find((s) => /triply/i.test(s.id)) || null;
  }
  if ((/stainless|\bdesire\b|\belite\b/.test(h)) && !/non-stick|non stick/.test(h)) {
    const s = sub.series.find((x) => x.id === "stainless-steel");
    if (s) return s;
  }
  return sub.series.find((s) => s.id === "aluminium") || sub.series[0];
}

function matchPressureCookerByHeuristic(product, catalog) {
  const pc = catalog.find((m) => m.id === "Pressure-Cooker");
  if (!pc) return null;
  const h = combinedHaystack(product);
  if (!/pressure|cooker|innerlid|outerlid|inner lid|outer lid|plain|handi|supreme|fine|prime|ultimate|heavy|litre|liter|\d+l\b/i.test(h)) {
    return null;
  }
  const inner = isInnerLidProduct(product);
  const outer = isOuterLidProduct(product);
  if (!inner && !outer) return null;

  const sub = pc.sub_categories.find((s) => s.id === (inner ? "inner-lid" : "outer-lid"));
  if (!sub?.series?.length) return null;

  const series = pickPressureSeries(sub, h, inner);
  if (!series?.options?.length) return null;

  for (const line of PC_LINE_ORDER) {
    if (new RegExp(`\\b${line}\\b`, "i").test(h)) {
      const opt = series.options.find(
        (o) => o.name === line || String(o.id).toLowerCase() === line.toLowerCase()
      );
      const sizes = sizesFromOption(opt);
      if (sizes?.length) return sizes;
    }
  }
  return null;
}

function matchSteamCookware(product, catalog) {
  const h = combinedHaystack(product);
  const main = catalog.find((m) => m.id === "steam-cookware");
  if (!main) return null;

  if (/idli/i.test(h) && !/multi\s*kadai|multikadai/i.test(h)) {
    const sub = main.sub_categories.find((s) => s.id === "idli-cooker");
    const isPrime = /\bprime\b/i.test(h) && !/\bsupreme\b/i.test(h);
    const serId = isPrime ? "prime" : "supreme";
    const ser = sub?.series?.find((s) => s.id === serId);
    if (!ser?.options?.length) return null;
    if (serId === "supreme" && /induction/i.test(h)) {
      const opt = ser.options.find((o) => o.id === "idli-sup-ind");
      return sizesFromOption(opt) || sizesFromOption(ser.options[0]);
    }
    const opt =
      ser.options.find((o) => String(o.id || "").includes("ni") || /non-induction/i.test(String(o.name || ""))) ||
      ser.options[0];
    return sizesFromOption(opt);
  }

  if (/multi\s*kadai|multikadai/i.test(h) || /\bsmk/i.test(h)) {
    const sub = main.sub_categories.find((s) => s.id === "multi-kadai");
    const isPrime = /\bprime\b/i.test(h) && !/\bsupreme\b/i.test(h);
    const serId = isPrime ? "prime" : "supreme";
    const ser = sub?.series?.find((s) => s.id === serId);
    if (!ser?.options?.length) return null;
    if (serId === "supreme" && /induction/i.test(h)) {
      const opt = ser.options.find((o) => o.id === "mk-sup-ind");
      return sizesFromOption(opt) || sizesFromOption(ser.options[0]);
    }
    const opt =
      ser.options.find((o) => String(o.id || "").includes("ni")) || ser.options[0];
    return sizesFromOption(opt);
  }
  return null;
}

function matchGasTandoor(product, catalog) {
  const h = combinedHaystack(product);
  if (!/tandoor|gas\s*tandoor/i.test(h)) return null;
  const main = catalog.find((m) => m.id === "gas-tandoor");
  if (!main) return null;

  if (/galvanis|galvaniz|iron\s*base/i.test(h)) {
    const sub = main.sub_categories.find((s) => s.id === "galvanised-iron-base");
    const order = ["supreme", "posh", "pep", "prime"];
    for (const line of order) {
      if (new RegExp(`\\b${line}\\b`, "i").test(h)) {
        const ser = sub?.series?.find((s) => s.id === line || new RegExp(line, "i").test(String(s.name || "")));
        const sz = sizesFromOption(ser?.options?.[0]);
        if (sz?.length) return sz;
      }
    }
  }
  if (/aluminium|aluminum|gold|heavy|elite/i.test(h)) {
    const sub = main.sub_categories.find((s) => s.id === "aluminium");
    for (const id of ["elite", "heavy", "gold"]) {
      if (new RegExp(`\\b${id}\\b`, "i").test(h)) {
        const ser = sub?.series?.find((s) => s.id === id);
        const sz = sizesFromOption(ser?.options?.[0]);
        if (sz?.length) return sz;
      }
    }
  }
  return null;
}

/**
 * Sizes / variants / burners / jars as defined in the mega-menu catalog for this product.
 * Uses SKU match first, then light heuristics for pressure cookers, steam cookware, gas tandoor.
 */
export function getCatalogDisplaySizesForProduct(product, catalog = staticCategories) {
  if (!product) return null;
  const bySku = matchBySku(product, catalog);
  if (bySku?.length) return bySku;

  const byPc = matchPressureCookerByHeuristic(product, catalog);
  if (byPc?.length) return byPc;

  const bySteam = matchSteamCookware(product, catalog);
  if (bySteam?.length) return bySteam;

  const byTandoor = matchGasTandoor(product, catalog);
  if (byTandoor?.length) return byTandoor;

  return null;
}

export function normalizeSizeToken(s) {
  return String(s || "")
    .replace(/\s+/g, "")
    .replace(/liter/gi, "L")
    .toLowerCase();
}
