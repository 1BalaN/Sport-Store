import React, { useContext, useEffect, useState, useCallback } from "react";
import { Col, Container, Row, Spinner, Form, Button } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import ItemList from "../components/ItemList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { getBrands, getItems, getTypes } from "../http/itemApi";
import Pages from "../components/Pages";
import "../pages/Shop.css";
import { debounce } from "lodash";

const Shop = observer(() => {
  const { item, cart } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поиска

  // Функция для обработки изменений в поле поиска
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Обновляем состояние поиска
  };

  // Дебаунс для фильтрации
  const debouncedFilter = useCallback(
    debounce(() => {
      item.setIsLoading(true);
      getItems(
        item.selectedType?.id || null,
        item.selectedBrand?.id || null,
        item.page,
        9,
        searchQuery
      ).then((data) => {
        item.setItems(data.rows);
        item.setTotalCount(data.count);
      }).finally(() => item.setIsLoading(false));
    }, 1500),
    [item, searchQuery]
  );

  useEffect(() => {
    getTypes().then((data) => item.setTypes(data));
    getBrands().then((data) => item.setBrands(data));
    getItems(null, null, 1, 9).then((data) => {
      item.setItems(data.rows);
      item.setTotalCount(data.count);
    });
  }, [item]);

  useEffect(() => {
    debouncedFilter();
  }, [item.page, item.selectedType, item.selectedBrand, searchQuery, debouncedFilter]);

  useEffect(() => {
    if (localStorage.getItem("cartItems")) {
      cart.setCart(JSON.parse(localStorage.getItem("cartItems")));
      cart.setQuantityCartItems();
    }
  }, []);

  // Функция для сброса поискового запроса
  const resetSearchQuery = () => {
    setSearchQuery("");
  };

  return (
    <>
      {item.isLoading ? (
        <div className="spinner__container">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : (
        <Container>
          <Row>
            <Col md={3}>
              <TypeBar resetSearch={resetSearchQuery} /> {/* Передаем resetSearch */}
            </Col>
            <Col md={9}>
              <BrandBar />
              <div className="search-container">
                <div className="search-input-wrapper">
                  <Form.Control
                    type="text"
                    placeholder="Поиск товара по названию"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchQuery && (
                    <Button
                      variant="outline-secondary"
                      onClick={resetSearchQuery}
                      className="clear-search-btn"
                    >
                      &#x2715;
                    </Button>
                  )}
                </div>
              </div>
              {!item.isLoading && item.items.length === 0 && (
                <div className="no-results">Товары не найдены</div>
              )}
              <ItemList />
              <Pages />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
});

export default Shop;
