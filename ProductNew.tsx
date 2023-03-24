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

const ProductList: FC<{}> = () => {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/products");
      setLoading(false);
      setProducts(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
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
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
    },
    [products, setProducts]
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {products?.length &&
        products.map((product) => {
          const {
            id,
            name,
            createdAt,
            addedToCart,
            description,
            images,
            shortDescription,
            price,
            attributes,
          } = product;

          return (
            <div key={id} className="product__wrapper">
              <div className="product__header">
                <p>
                  {name}
                  <span className="product__date">
                    {createdAt.toLocaleString()}
                  </span>
                </p>
                <Button onClick={() => addToCart(product)}>
                  {addedToCart ? "Buy again" : "Buy"}
                </Button>
              </div>
              <div className="product__body">
                <p>{description}</p>
                <p>{attributes}</p>
                {images?.length
                  ? images.map((url: string, idx: number) => (
                      <img key={idx} src={url} alt={name} />
                    ))
                  : ""}
              </div>
              <div className="product__footer">
                <p>{shortDescription}</p>
                {price}
                <Button onClick={() => addToCart(product)}>
                  {addedToCart ? "Buy again" : "Buy"}
                </Button>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ProductList;
