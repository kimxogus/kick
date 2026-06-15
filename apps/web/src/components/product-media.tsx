import type { Product } from "@/server/kick-service";

type ProductMediaProps = {
  product: Product;
  className: string;
};

export function ProductMedia({ product, className }: ProductMediaProps) {
  if (product.emoji) {
    return (
      <div aria-label={`${product.name} icon`} className={`${className} product-emoji-visual`} role="img">
        {product.emoji}
      </div>
    );
  }

  return <img alt="" className={className} src={product.thumbnailUrl} />;
}
