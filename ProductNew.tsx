import { useEffect, useState, FC, useCallback } from "react";

interface ProductEntity {
  id: number;
  name: string;
  createdAt: Date;
  price: number;
  description: string;
  shortDescription: string;
  addedToCart: boolean;
  attributes: string;
  images: string[];
}

const ProductList: FC = () => {
  const [products, setProducts] = useState<ProductEntity[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const data = await api("/products");
      setProducts(data);
    } catch (e) {
      throw new Error(e);
    }
  }, [setProducts]);

  useEffect(() => {
    getProducts();
  }, []);

  const addToCart = useCallback(
    async (product: ProductEntity): Promise<void> => {
      try {
        const dataProduct = await api("/add-to-card", {
          ...product,
          addedToCart: !product.addedToCart,
        });
        const updatedProducts = products.map((updProduct: ProductEntity) =>
          updProduct.id === dataProduct.id ? dataProduct : updProduct
        );
        setProducts(updatedProducts);
      } catch (e) {
        throw new Error(e);
      }
    },
    [products, setProducts]
  );

  return (
    products?.length &&
    products.map((product) => {
      <div className="product__wrapper">
        <div className="product__header">
          <p>
            {product.name}
            <div className="product__date">
              {product.createdAt.toLocaleString()}
            </div>
          </p>
          <Button onClick={() => addToCart(product)} type="button">
            {product.addedToCart ? "Buy again" : "Buy"}
          </Button>
        </div>
        <div className="product__body">
          <p>{product.description}</p>
          <p>{product.attributes}</p>
          {product?.images?.length &&
            product.images.map((url: string, idx: number) => (
              <img key={idx} src={url} alt={product.name} />
            ))}
        </div>
        <div className="product__footer">
          <p>{product.shortDescription}</p>
          {product.price}
          <Button onClick={() => addToCart(product)} type="button">
            {product.addedToCart ? "Buy again" : "Buy"}
          </Button>
        </div>
      </div>;
    })
  );
};

export default ProductList;