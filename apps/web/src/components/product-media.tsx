import type { Product } from "@/server/kick-service";

type ProductMediaProps = {
  product: Product;
  className: string;
};

// 제품 비주얼: emoji가 있으면 emoji 썸네일, 없으면 brand 썸네일 이미지.
export function ProductMedia({ product, className }: ProductMediaProps) {
  if (product.emoji) {
    return (
      <div
        aria-label={`${product.name} 비주얼`}
        className={`${className} product-media product-emoji-visual`}
        role="img"
      >
        <span aria-hidden="true">{product.emoji}</span>
      </div>
    );
  }

  return (
    <img
      alt={`${product.name} 비주얼`}
      className={`${className} product-media`}
      src={product.thumbnailUrl}
    />
  );
}
