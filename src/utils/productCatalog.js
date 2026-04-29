import productCatalogPdfUrl from "../components/assets/SUMMIT 2026.pdf";

export const PRODUCT_CATALOG_DOWNLOAD_NAME = "SUMMIT 2026.pdf";

/** Triggers a file download of the product catalog (same PDF for all flows). */
export async function downloadProductCatalog() {
  try {
    const res = await fetch(productCatalogPdfUrl);
    if (!res.ok) throw new Error("Catalog fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = PRODUCT_CATALOG_DOWNLOAD_NAME;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(productCatalogPdfUrl, "_blank", "noopener,noreferrer");
  }
}
