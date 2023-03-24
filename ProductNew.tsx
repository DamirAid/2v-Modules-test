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
        // тут я кидаю не новую ошибку а в зависимости от инстанса кидаю текущую ошибку, тоесть инстансов будет много
        // в зависимости от кодов ошибки например BadRequestException NotFountException и тд,и в зависимости от инстанса мы
        // будем выполнять разную логику отображения, потому что просто показывать все ошибки в этом компоненте неправильно
        // какие-то касаются валидации, при каких то мы возможно переборосим на другую страницу и тд,
        // так как ui части в тех задании не описано, я не прокидывал ошибку в состояниe setError, чтобы потом отобразить ее
        // я сделал минимальную заготовку
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
                {/* вот я создал компонент баттона, так как опять же тех задание было на ревью именно этого компонента, я новый компонент
                  не создавал сразу, щас последним коммитом создал Button.tsx., а так можно было еще ммного чего тут добавить в зависимости 
                  от более подробных входных данных ui дизайна, тз функциональности более подробное и тд, я описал в комментах что бы 
                  я добавил но не делал этого из за недостаточных входных данных.
                  Даже если взять этот пример с баттоном, я создал щас компонент с минимальным функционал, но естесственно я мог бы добавить
                  туда Темизацию, размеры кнопок, вид кнопки, fullWidth, square подключить бы библиотеку classNames или же написать свою
                  и еще много пропсов, но из-за отсутсвия ui kita я этого не делал,  и соотвественно тех задание наверное звучало бы по другому)
                  не просто ревью кода и предоставьте свой вариант данного компонента
                */}
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
