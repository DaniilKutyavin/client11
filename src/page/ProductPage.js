import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "../style/product.css";
import Store from "../componenets/Store";
import iconProd from "../img/Образец ХСЗР на сайт.png";
import arrowRight from "../img/стрелка вниз.svg"; // Import your custom arrow image
import bask from "../img/корзина белая 1.svg";
import Shkal from "../componenets/Shkal";
import {
  getProduct,
  addToBasket,
  getProductsByManufacturer,
} from "../http/productApi";
import { observer } from "mobx-react-lite";
import Ls from "../img/человек 500.svg";
import Ras from "../img/Расход рабочей жидкости.png";
import Srok from "../img/срок ожидания и кратность обработки.png";
import Hran from "../img/Срок хранения.png";
import Upak from "../img/Упаковка.png";
import upakhran from "../img/Условия хранения.png";
import { Context } from "..";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); 
  const [fontSize, setFontSize] = useState("5vw");
  const [marginTop, setMarginTop] = useState("0");  // Изначальный размер шрифта
  const [manufacturerInfo, setManufacturerInfo] = useState(null);
  const { user } = useContext(Context);
  useEffect(() => {
    const fetchProductAndManufacturer = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);

        // Получение информации о производителе после получения продукта
        const manufacturerData = await getProductsByManufacturer(
          data.manufacturer
        );
        setManufacturerInfo(manufacturerData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductAndManufacturer();
  }, [id]);

  useEffect(() => {
    if (product?.name) {
      const textLength = product.name.length;
      if (textLength >= 14) {
        setFontSize("11vw");
        setMarginTop("80px"); // Уменьшите размер шрифта
      } else if (textLength > 0 && textLength < 7) {
        setFontSize("20vw");
        setMarginTop("80px");
      } 
      else if (textLength > 8 && textLength < 10) {
        setFontSize("15vw");
        setMarginTop("80px");
      }
      else {
        setFontSize("15vw");
        setMarginTop("80px"); // Восстановите оригинальный размер шрифта
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToBasket(product.id, 1);
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
    }
  };

  const handleAddToCartG = () => {
    if (!product) return; // Проверка на наличие продукта
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
  
    if (existingItemIndex > -1) {
      // Если товар уже в корзине, увеличиваем его количество
      cart[existingItemIndex].quantity += 1;
    } else {
      // Если товара нет, добавляем его в корзину
      cart.push({
        id: product.id,
        name: product.name,
        img: product.img,
        weight: product.weight,
        description_low: product.description_low,
        price: product.price,
        price_two: product.price_two,
        quantity: 1, 
      });
    }
  
    // Сохраняем обновлённую корзину в localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // Создаём кастомное событие для уведомления других компонентов
    const event = new Event("cartUpdated");
    window.dispatchEvent(event); // Триггерим событие
  };

  return (
    <>
      <div className="header nonimg">
        <div className="title-block">
          <h1>{product?.name}</h1>
          <p className="pod">{product?.desc_header}</p>
        </div>
      </div>

      <div className="productPage">
        <div className="backgroundText" style={{ fontSize, marginTop }}>
          {product?.name}
        </div>
        <div className="productImageAndPrice nevid">
              <div className="productImage">
                <img
                  src={process.env.REACT_APP_API_URL + product?.img}
                  alt={product?.name}
                />
              </div>
            </div>
        <div className="priceSection nevid">
            <span className="price">{product?.price} ₽</span>
            <div className="separator" />
            <button className="addToCartButton" onClick={user.isAuth ? handleAddToCart : handleAddToCartG}>
              <img src={bask} alt="Корзина" />
            </button>
          </div>
        <div className="productCard">
          <div className="productInfo">
         
            <div className="opisanienaz">
          <h1>{product?.name}</h1>
          <p>{product?.desc_header}</p>
        </div>
            <div className="textContent">
              <p className="description">{product?.description}</p>
              <p className="highlightedInfo">{product?.description_low}</p>
              <div className="productVolume">
                <span className="pod">{product?.weight}</span>
                <p className="producer">Производитель:</p>
                <img
                  className="manimg"
                  src={process.env.REACT_APP_API_URL + manufacturerInfo?.logo}
                  alt={product?.manufacturer}
                />
                <div className="sertif">
                {product?.presentation && (
                  <p className="pdfLink">
                    <a
                      className="no-style-link"
                      href={`${process.env.REACT_APP_API_URL}${product?.presentation}`}
                    >
                      <spam className="dot "></spam> Презентация PDF
                    </a>
                  </p>
                    )}
                    {product?.certificate && (
                  <p className="pdfLink">
                    <a
                      className="no-style-link"
                      href={`${process.env.REACT_APP_API_URL}${product?.certificate}`}
                    >
                      <spam className="dot "></spam> Свидетельство PDF
                    </a>
                  </p>
                   )}
                </div>
              </div>
            </div>
            <div className="productImageAndPrice nonimg">
              <div className="productImage">
                <img
                  src={process.env.REACT_APP_API_URL + product?.img}
                  alt={product?.name}
                />
              </div>
            </div>
          </div>
          <div className="priceSection nonimg">
            <span className="price">{product?.price} ₽</span>
            <div className="separator" />
            <button className="addToCartButton"  onClick={user.isAuth ? handleAddToCart : handleAddToCartG}>
              <img src={bask} alt="Корзина" />
            </button>
          </div>

          <div className="accordionSection">
            {/* Common details */}

            {/* Render sections based on product type */}
            {product?.type === 1 && (
              <>
                <details className="accordion">
                  <summary>
                    Преимущества{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.adva.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                </details>
                <details className="accordion">
                  <summary>
                    Регламент применения{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                 <div className="table-container">
      <div
        dangerouslySetInnerHTML={{ __html: product?.htmlTable }}
      />
    </div>
                  <div className="storage-content">
                  {product?.waiting ? (
      <div className="storage-item">
        <img src={Srok} alt="Icon" className="storage-icon" />
        <div className="storage-text">
          <h3>Срок ожидания и кратность обработки</h3>
          <p>{product?.waiting}</p>
        </div>
      </div>
    ) : null} {/* Если пусто, не рендерим */}

    {/* Проверяем, есть ли значение для product?.expenditure */}
    {product?.expenditure ? (
      <div className="storage-item textttt">
        <img src={Ras} alt="Icon" className="storage-icon" />
        <div className="storage-text">
          <h3>Расход рабочей жидкости</h3>
          <p>{product?.expenditure}</p>
        </div>
      </div>
    ) : null}
                  </div>
                  {/* Add content for Регламент */}
                </details>
                <details className="accordion">
                  <summary>
                    Описание{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  {product.desc.map((desc) => (
                    <>
                      <h3 key={desc.id}>{desc.title}</h3>
                      <p>{desc.text}</p>
                    </>
                  ))}
                </details>
                <details className="accordion">
                  <summary>
                    Упаковка и хранение{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <div className="storage-content">
                    <div className="storage-item">
                      <img src={Hran} alt="Icon" className="storage-icon" />
                      <div className="storage-text">
                        <h3>Срок хранения</h3>
                        <p>{product?.shelf}</p>
                      </div>
                    </div>

                    <div className="storage-item textttt">
                      <img src={Upak} alt="Icon" className="storage-icon" />
                      <div className="storage-text">
                        <h3>Упаковка</h3>
                        <p>{product?.packaging}</p>
                      </div>
                    </div>

                    <div className="storage-item">
                      <img src={upakhran} alt="Icon" className="storage-icon" />
                      <div className="storage-text">
                        <h3>Условия хранения</h3>
                        <p>{product?.conditions}</p>
                      </div>
                    </div>
                  </div>
                </details>
              </>
            )}
            {product?.type === 2 && (
              <>
                <details className="accordion">
                  <summary>
                    Описание{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  {product?.descTwo}
                </details>
                <details className="accordion">
                  <summary>
                    Характеристики{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.adva.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                  {/* Add content for характеристики */}
                </details>
                <details className="accordion">
                  <summary>
                    Преимущества{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.specif.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                </details>
                <details className="accordion">
                  <summary>
                    Упаковка и хранение{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>

                  {product.keep.map((adv) => (
                    <p key={adv.id}>{adv.text}</p>
                  ))}
                </details>
              </>
            )}
            {product?.type === 3 && (
              <>
                <details className="accordion">
                  <summary>
                    Описание{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  {product?.descThree
                  }
                </details>
                <details className="accordion">
                  <summary>
                    Характеристики{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.adva.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                </details>
                <details className="accordion">
                  <summary>
                    Урожайность{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.productiv.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                </details>
                <details className="accordion">
                  <summary>
                    Устойчивость гибрида{" "}
                    <img
                      src={arrowRight}
                      alt="Arrow"
                      className="accordion-arrow"
                    />
                  </summary>
                  <ul className="advantages-list">
                    {product.stabil.map((adv) => (
                      <li key={adv.id}>{adv.text}</li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </div>
        </div> 
      </div>
      <Store />
      <Shkal />
    </>
  );
};

export default observer(ProductPage);
