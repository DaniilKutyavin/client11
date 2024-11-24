import React, { useState, useEffect } from "react";
import { getProductsByType } from "../http/productApi"; // Ensure the API function is correctly imported
import "../style/ProductBuyForm.css";

const ProductForm = ({ productId }) => {
  const [products, setProducts] = useState([]); // Store an array of products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsByType(productId); // Fetch products by the given type (productId)
        setProducts(fetchedProducts); // Store the array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    if (productId) {
      fetchProducts(); // Fetch products when productId is available
    }
  }, [productId]); // Re-fetch products if productId changes

  if (loading) return <div>Loading...</div>; // Show loading state until data is fetched

  if (!products.length) return <div>No products found.</div>; // If no products found, show a message

  return (
    <>
      <h2>Список товаров</h2>
      <ul className="productBuyForm_productList">
        {products.map((product) => ( // Map over the products array
          <li key={product.id} className="productBuyForm_productItem">
            {product.name} - {product.price} ₽
            <button className="productBuyForm_submitButton">Редактировать</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProductForm;
