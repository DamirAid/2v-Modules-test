import { useEffect, useState } from 'react';

const Component = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const getProductsFromApi = async () => setProducts(await api('/products'));

    getProductsFromApi()
  }, [])

  const addToCart = (product): void => {
    api('/add-to-card', { product });

    product.addedToCart = true;
  }

  return (
    products.map((product) => {
      <div className="product">
        <div className="header">
          <p>{product.name} <small>{product.createdAt.toLocaleString()}</small></p>
          <button onClick={() => addToCart(product)} type="button">{product.addedToCart ? 'Buy again' : 'Buy'}</button>
        </div>
        <div className="body">
          <p>{product.description}</p>
          <p>{product.attributes}</p>
          {product.images.map((url) => <img src={url} alt={product.name} />)}
        </div>
        <div className="footer">
          <p>{product.shortDescription}</p>
          {product.price}
          <button onClick={() => addToCart(product)} type="button">{product.addedToCart ? 'Buy again' : 'Buy'}</button>
        </div>
      </div>
    })
  )
}