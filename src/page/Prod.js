import React, { useState, useContext, useEffect } from "react";
import "../style/Prod.css";
import bask from "../img/корзина белая 1.svg";
import iconProd from "../img/Образец ХСЗР на сайт.png";
import filter from '../img/Фильтр иконка.svg';
import arrowDown from "../img/стрелка вниз.svg";
import lupa from "../img/лупа.svg";
import krest from "../img/крестик.svg";
import Store from "../componenets/Store";
import Shkal from "../componenets/Shkal";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { getProductsByType, addToBasket } from "../http/productApi";
import {
  getManufacturersByTypeOne,
  getManufacturersByTypeTwo,
  getManufacturersByTypeThree,
} from "../http/manufacturerApi";
import { getAll} from "../http/infocartApi";
import { useParams, useLocation, Link } from "react-router-dom";

const Prod = observer(() => {
  const { user } = useContext(Context);
  const { id } = useParams();
  const { product } = useContext(Context);
  const [manufacturers, setManufacturers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProduct] = useState(null);
  const [isLeftSectionOpen, setIsLeftSectionOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const toggleLeftSection = () => {
    setIsLeftSectionOpen((prev) => !prev);
  };

  
  const [filtersOpen, setFiltersOpen] = useState({
    category: true,
    categoryTwo: true,
    culture: true,
    manufacturer: true,
    fertilizers: true,
    way: true,
    ground: true,
    cultureTwo: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    categoryTwos: [],
    cultures: [],
    cultureTwos: [],
    manufacturers: [],
    fertilizerss: [],
    ways: [],
    grounds: [],
  });

  const location = useLocation();

  useEffect(() => {
    // Fetch products by type
    getProductsByType(id).then((data) => {
      const productsWithCategory = data.map((product) => ({
        ...product,
      }));
      product.setProd(productsWithCategory);
    });


    // Fetch manufacturers based on product type
    const fetchManufacturers = async () => {
      try {
        let data;
        switch (id) {
          case "1":
            data = await getManufacturersByTypeOne();
            break;
          case "2":
            data = await getManufacturersByTypeTwo();
            break;
          case "3":
            data = await getManufacturersByTypeThree();
            break;
          default:
            data = [];
        }
        setManufacturers(data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      }
    };

    fetchManufacturers();

    // Clear selected filters on page change
    setSelectedFilters({
      categories: [],
      categoryTwos: [],
      cultures: [],
      cultureTwos: [],
      manufacturers: [],
      fertilizerss: [],
      ways: [],
      grounds: [],
    });
    setSearchQuery("");
  }, [id, location.pathname, product]); // Watch for location.pathname to reset filters

  const handleAddToCart = async (productId) => {
    try {
      await addToBasket(productId, 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  const handleAddToCartG = (item) => {
    if (!item) return; // Ensure item is available
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
  
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        img: item.img, 
        weight: item.weight,
        description_low: item.description_low,
        price: item.price,
        price_two: item.price_two,
        quantity: 1,
      });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // Создание кастомного события для уведомления о обновлении корзины
    const event = new Event("cartUpdated");
    window.dispatchEvent(event); // Триггерим событие
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const [isInfoBlockVisible, setIsInfoBlockVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const toggleFilter = (filter) => {
    setFiltersOpen({
      ...filtersOpen,
      [filter]: !filtersOpen[filter],
    });
  };

  const closeInfoBlock = () => {
    setIsInfoBlockVisible(false);
  };

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
    
    // Прокрутка страницы в начало
  }
};
useEffect(() => {
  // Прокрутка страницы в верх
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [currentPage]);
  // Filter products based on selected filters
  const filteredProducts = product.prod.filter((item) => {
    const matchesSearchQuery = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  
    const matchesCategory =
      selectedFilters.categories.length === 0 ||
      selectedFilters.categories.some((filterValue) =>
        (item.category ? item.category.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesCategoryTwo =
      selectedFilters.categoryTwos.length === 0 ||
      selectedFilters.categoryTwos.some((filterValue) =>
        (item.category ? item.category.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesCulture =
      selectedFilters.cultures.length === 0 ||
      selectedFilters.cultures.some((filterValue) =>
        (item.culture ? item.culture.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesCultureTwo =
      selectedFilters.cultureTwos.length === 0 ||
      selectedFilters.cultureTwos.some((filterValue) =>
        (item.culture ? item.culture.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesManufacturer =
      selectedFilters.manufacturers.length === 0 ||
      selectedFilters.manufacturers.includes(item.manufacturer);
  
    const matchesFertilizers =
      selectedFilters.fertilizerss.length === 0 ||
      selectedFilters.fertilizerss.some((filterValue) =>
        (item.fertilizers ? item.fertilizers.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesWays =
      selectedFilters.ways.length === 0 ||
      selectedFilters.ways.some((filterValue) =>
        (item.way ? item.way.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    const matchesGrounds =
      selectedFilters.grounds.length === 0 ||
      selectedFilters.grounds.some((filterValue) =>
        (item.ground ? item.ground.split(";").map((val) => val.trim()) : []).includes(filterValue)
      );
  
    return (
      matchesSearchQuery &&
      matchesCategory &&
      matchesCategoryTwo &&
      matchesCulture &&
      matchesCultureTwo &&
      matchesManufacturer &&
      matchesFertilizers &&
      matchesWays &&
      matchesGrounds
    );
  });
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  // Get products for the current page
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });
  
  // Use `sortedProducts` instead of `filteredProducts` for pagination
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getPageNumbers = () => {
    const totalPagesToShow = 5; // Number of pages to show in pagination
    const pages = [];

    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      // Add first page
      pages.push(1);

      // Ellipsis before current range
      if (left > 2) {
        pages.push("...");
      }

      // Add pages around current
      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      // Ellipsis after current range
      if (right < totalPages - 1) {
        pages.push("...");
      }

      // Add last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle filter selection
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        newFilters[filterType].push(value);
      }
      return newFilters;
    });
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      categoryTwos: [],
      cultures: [],
      cultureTwos: [],
      manufacturers: [],
      fertilizerss: [],
      ways: [],
      grounds: [],
    });
  };
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAll();
        const sortedData = data.sort((a, b) => a.id - b.id);
        setCartItems(sortedData);
      } catch (err) {
        console.log("Ошибка при загрузке данных");
      }
    };
    fetchData();
  }, []);
  const textItem1 = cartItems.find((item) => item.id === 1);
  const textItem2 = cartItems.find((item) => item.id === 2);
  const textItem3 = cartItems.find((item) => item.id === 3);
  const isProductType1 = location.pathname === "/product/type/1";
  const isProductType2 = location.pathname === "/product/type/2";
  const isProductType3 = location.pathname === "/product/type/3";
  return (
    <>
      <div className="header">
        <div className="title-block">
        {isProductType1 && (
          <> <h1>ХСЗР</h1>
          <p className="pod">Обеспечьте защиту Ваших культур</p></>
        )}
         {isProductType2 && (
          <> <h1>Удобрения</h1>
          <p className="pod">Доставка удобрений осуществляется от 20т</p></>
        )}
         {isProductType3 && (
          <> <h1>Посевной материал</h1>
          <p className="pod">Гарантия будущего урожая</p></>
        )}
        
        </div>

        {isInfoBlockVisible && (
  <div className="info-block">
    <span className="exclamation">!</span>
    <div className="info-text">
      {isProductType1 && textItem1?.desc ? (
         <div dangerouslySetInnerHTML={{ __html: textItem1.desc.replace(/\n/g, "<br />") }} />
      ) : isProductType2 && textItem2?.desc ? (
        <div dangerouslySetInnerHTML={{ __html: textItem2.desc.replace(/\n/g, "<br />") }} />
      ) : isProductType3 && textItem3?.desc ? (
        <div dangerouslySetInnerHTML={{ __html: textItem3.desc.replace(/\n/g, "<br />") }} />
      ) : (
        <p>Информация недоступна</p> 
      )}
    </div>
    <button className="close-btn" onClick={closeInfoBlock}>
      <img src={krest} alt="Закрыть" />
    </button>
  </div>
)}
      </div>

      <div className="wrapperr">
      <button
      className="sort-button"
      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
    >
      Сортировать по цене: {sortOrder === "asc" ? "↑" : "↓"}
    </button>
      <span 
            className="toggle-button" 
            onClick={toggleLeftSection}
          >
           <img src={filter} alt="фильтр" />
          </span>
          
        <div className="catalog-containerr full-width">
          {/* Левая секция с поиском и фильтрами */}
          <div className={`left-section ${isLeftSectionOpen ? 'open' : ''}`}>
            {isProductType1 && (
              <div className="filter-block">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange} // обработка ввода поиска
                    className="search-input"
                  />
                  <span className="search-icon">
                    <img src={lupa} alt="Search" />
                  </span>
                  <button className="close-button rom" onClick={toggleLeftSection}>×</button>
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("category")}>
                    Категория
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.category ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.category && (
                    <div className="filter-content">
                      {[
                        "Гербициды",
                        "Инсектициды",
                        "Фунгициды",
                        "Протравители",
                        "Адьюванты",
                        "Регуляторы роста",
                        "Десиканты",
                        "Фумиганты и родентициды",
                      ].map((category, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`category-${index}`}
                            value={category}
                            checked={selectedFilters.categories.includes(
                              category
                            )}
                            onChange={() =>
                              handleFilterChange("categories", category)
                            }
                          />
                          <label htmlFor={`category-${index}`}>
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("culture")}>
                    Культура
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.culture ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.culture && (
                    <div className="filter-content">
                      {[
                        "Зерновые",
                        "Кукуруза",
                        "Подсолнечник",
                        "Сахарная свекла",
                        "Соя",
                        "Рапс",
                        "Картофель",
                        "Нут",
                        "Горох",
                        "Томаты",
                        "Огурцы",
                        "Лук",
                        "Виноградники",
                        "Плодовые",
                        "Лен",
                        "Капуста",
                        "Свекла столовая",
                        "Морковь",
                        "Рис",
                        "Пары",
                        "Пастбища и кормовые травы",
                        "Декоративные",
                        "Лекарственные",
                        "Саранчовые",
                        "Индустриальные объекты",
                        "Гречиха",
                        "Чечевица",
                        "Пшеница",
                        "Ячмень",
                        "Овес",
                        "Рожь",
                        "Люпин",
                        "Люцерна",
                        "Чеснок",
                      ].map((culture, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`culture-${index}`}
                            value={culture}
                            checked={selectedFilters.cultures.includes(culture)}
                            onChange={() =>
                              handleFilterChange("cultures", culture)
                            }
                          />
                          <label htmlFor={`culture-${index}`}>{culture}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("manufacturer")}>
                    Производитель
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.manufacturer ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.manufacturer && (
                    <div className="filter-content">
                      {manufacturers.map((manufacturer, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`manufacturer-${index}`}
                            value={manufacturer.name}
                            checked={selectedFilters.manufacturers.includes(
                              manufacturer.name
                            )}
                            onChange={() =>
                              handleFilterChange(
                                "manufacturers",
                                manufacturer.name
                              )
                            }
                          />
                          <label htmlFor={`manufacturer-${index}`}>
                            {manufacturer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="filter-cancel-button" onClick={clearFilters}>
                  Очистить
                </button>
              </div>
            )}
            {isProductType2 && (
              <div className="filter-block">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange} // обработка ввода поиска
                    className="search-input"
                  />
                  <span className="search-icon">
                    <img src={lupa} alt="Search" />
                  </span>
                  <button className="close-button rom" onClick={toggleLeftSection}>×</button>
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("fertilizers")}>
                    Виды удобрений
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.fertilizers ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.fertilizers && (
                    <div className="filter-content">
                      {[
                        "Азотные N",
                        "Фосфорные P",
                        "Калийные K",
                        "Комплексные N+P+K",
                        "Водорастворимые",
                        "Жидкие",
                      ].map((fertilizers, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`fertilizers-${index}`}
                            value={fertilizers}
                            checked={selectedFilters.fertilizerss.includes(
                              fertilizers
                            )}
                            onChange={() =>
                              handleFilterChange("fertilizerss", fertilizers)
                            }
                          />
                          <label htmlFor={`fertilizers-${index}`}>
                            {fertilizers}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("cultureTwo")}>
                    Культура
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.cultureTwo ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.cultureTwo && (
                    <div className="filter-content">
                      {["Зерновые", "Масличные", "Зернобобовые", "Овощные", "Плодовые", "Корнеплоды/клубнеплоды", "Ягодные", "Зеленные", "Прядильные"].map(
                        (cultureTwo, index) => (
                          <div key={index}>
                            <input
                              type="checkbox"
                              className="custom-checkbox"
                              id={`cultureTwo-${index}`}
                              value={cultureTwo}
                              checked={selectedFilters.cultureTwos.includes(
                                cultureTwo
                              )}
                              onChange={() =>
                                handleFilterChange("cultureTwos", cultureTwo)
                              }
                            />
                            <label htmlFor={`cultureTwo-${index}`}>
                              {cultureTwo}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("way")}>
                    По способу внесения
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.way ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.way && (
                    <div className="filter-content">
                      {[
                        "Основное внесение",
                        "Припосевное внесение",
                        "Листовые подкормки",
                        "Фертигация",
                        "Капельный полив",
                        "Корневая подкормка",
                        "Обработка семян",
                      ].map((way, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`way-${index}`}
                            value={way}
                            checked={selectedFilters.ways.includes(way)}
                            onChange={() => handleFilterChange("ways", way)}
                          />
                          <label htmlFor={`way-${index}`}>{way}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("ground")}>
                    Вид грунта
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.ground ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.ground && (
                    <div className="filter-content">
                      {["Открытый", "Закрытый"].map((ground, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`ground-${index}`}
                            value={ground}
                            checked={selectedFilters.grounds.includes(ground)}
                            onChange={() =>
                              handleFilterChange("grounds", ground)
                            }
                          />
                          <label htmlFor={`ground-${index}`}>{ground}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("manufacturer")}>
                    Производитель
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.manufacturer ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.manufacturer && (
                    <div className="filter-content">
                      {manufacturers.map((manufacturer, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`manufacturer-${index}`}
                            value={manufacturer.name}
                            checked={selectedFilters.manufacturers.includes(
                              manufacturer.name
                            )}
                            onChange={() =>
                              handleFilterChange(
                                "manufacturers",
                                manufacturer.name
                              )
                            }
                          />
                          <label htmlFor={`manufacturer-${index}`}>
                            {manufacturer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="filter-cancel-button" onClick={clearFilters}>
                  Очистить
                </button>
              </div>
            )}
            {isProductType3 && (
              <div className="filter-block">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange} // обработка ввода поиска
                    className="search-input"
                  />
                  <span className="search-icon">
                    <img src={lupa} alt="Search" />
                  </span>
                  <button className="close-button rom" onClick={toggleLeftSection}>×</button>
                </div>
                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("categoryTwo")}>
                    Категория
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.categoryTwo ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.categoryTwo && (
                    <div className="filter-content">
                      {[
                        "Подсолнечник",
                        "Рапс",
                        "Кукуруза",
                        "Пшеница",
                        "Ячмень",
                        "Нут",
                        "Горох",
                        "Горчица",
                        "Соя",
                      ].map((categoryTwo, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`categoryTwo-${index}`}
                            value={categoryTwo}
                            checked={selectedFilters.categoryTwos.includes(
                              categoryTwo
                            )}
                            onChange={() =>
                              handleFilterChange("categoryTwos", categoryTwo)
                            }
                          />
                          <label htmlFor={`categoryTwo-${index}`}>
                            {categoryTwo}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-section">
                  <h2 onClick={() => toggleFilter("manufacturer")}>
                    Производитель
                    <img
                      src={arrowDown}
                      alt="Arrow Down"
                      className={`filter-arrow ${
                        filtersOpen.manufacturer ? "open" : ""
                      }`}
                    />
                  </h2>
                  {filtersOpen.manufacturer && (
                    <div className="filter-content">
                      {manufacturers.map((manufacturer, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            id={`manufacturer-${index}`}
                            value={manufacturer.name}
                            checked={selectedFilters.manufacturers.includes(
                              manufacturer.name
                            )}
                            onChange={() =>
                              handleFilterChange(
                                "manufacturers",
                                manufacturer.name
                              )
                            }
                          />
                          <label htmlFor={`manufacturer-${index}`}>
                            {manufacturer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="filter-cancel-button" onClick={clearFilters}>
                  Очистить
                </button>
              </div>
            )}
          </div>
          {/* Правая секция с карточками продуктов */}
          <div className="right-section">
            
            <div className="product-grid">
              {currentProducts.map((item, index) => (
                <div className="product-card" key={index}>
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={process.env.REACT_APP_API_URL + item.img}
                      alt="Product"
                      className="product-image"
                    />
                    <h4 className="product-title">{item.name}</h4>
                    <p className="product-description">
                      {item.description_low}
                    </p>
                    <p className="pod product-volume">{item.weight}</p>
                  </Link>
                  <div className="price-container">
                    <span className="product-price">{item.price}₽</span>

                    {user.isAuth ? (
        // If user is authenticated, use the first cart icon with `handleAddToCart`
        <img
          className="cart-icon"
          src={bask}
          alt="Add to Cart"
          onClick={() => handleAddToCart(item.id)}
        />
      ) : (
        // If user is not authenticated, use the second cart icon with `handleAddToCartG`
        <img
          className="cart-icon"
          src={bask}
          alt="Add to Cart"
          onClick={() => handleAddToCartG(item)}
        />
      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            <div className="pagination">
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <img
                  src={arrowDown}
                  alt="Previous"
                  style={{ transform: "rotate(90deg)" }}
                />
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="pagination-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={`pagination-page ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <img
                  src={arrowDown}
                  alt="Next"
                  style={{ transform: "rotate(-90deg)" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Shkal />
      <Store />
    </>
  );
});

export default Prod;
