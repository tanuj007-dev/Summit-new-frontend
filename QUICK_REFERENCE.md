# Image Optimization — Quick Reference

Print this and keep it handy during implementation!

## Basic Usage

Old (regular img):

```html
<img src="/product.jpg" alt="Product" class="w-64 h-64" />
```

New (optimized):

```jsx
<OptimizedImage 
  src="/product.jpg"
  alt="Product"
  width={256}
  height={256}
  className="w-64 h-64"
/>
```

## Common Patterns

1) Hero banner (above-fold — use `priority={true}`)

```jsx
<OptimizedImage
  src={heroImage}
  alt="Hero"
  width={1920}
  height={600}
  priority={true}
  className="w-full h-96"
  sizes="100vw"
/>
```

2) Product card (use preset)

```jsx
<OptimizedImage {...PRESETS.productCard} src={product.image} alt={product.name} />
```

3) Product thumbnail (small, lazy)

```jsx
<OptimizedImage {...PRESETS.productThumbnail} src={product.image} alt={product.name} />
```

4) User avatar (fixed size)

```jsx
<OptimizedImage {...PRESETS.userAvatar} src={user.avatar} alt={user.name} />
```

## Props Quick Reference

- `src` (required)
- `alt` (required)
- `width`, `height` (provide to prevent CLS)
- `priority` (true for LCP images)
- `placeholder` (fallback)
- `sizes`, `srcSet` (for responsive images)
- `quality` (optional)

## Migration: LazyImage -> OptimizedImage

Replace:

```jsx
<LazyImage src={src} alt={alt} />
```

With:

```jsx
<OptimizedImage src={src} alt={alt} width={300} height={300} />
```

Key difference: add `width` and `height` to prevent layout shift.

## Common Mistakes

- Missing `width`/`height` — always include dimensions.
- Using `priority={true}` for every image — only above-fold images.
- Not providing `alt` text — always include descriptive `alt`.

## Testing Checklist

- Image loads correctly (Network tab)
- Placeholder shows while loading
- No console errors
- No layout shift
- Works on mobile
- Works on throttled network (3G)
- Fallback shows if image broken
- Lighthouse score improved

## Phase-based rollout

- Week 1: Hero banners + header logo
- Week 2-3: Product grid, product detail, galleries
- Week 4: Content pages, blog, cart, checkout

## Success metrics

- LCP < 2.5s
- CLS < 0.1
- Lighthouse +5–15 points

---

For full docs see `QUICK_START.md`, `S3_SETUP_GUIDE.md`, and other documentation files in the repository.
