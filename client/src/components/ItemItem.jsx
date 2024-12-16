import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ITEM_ROUTE } from "../utils/consts";
import { Context } from "..";
import { deleteItem, getItems } from "../http/itemApi";
import DeleteItem from "./models/DeleteItem";
import EditItem from "./models/EditItem";
import "../pages/cards.css";
import { toast } from "react-toastify";
import { addToBasket } from "../http/basketApi";

const ItemItem = ({ dev, brandName }) => {
  const { user, item, cart } = useContext(Context);
  const [deleteItemVisible, setDeleteItemVisible] = useState(false);
  const [editItemVisible, setEditItemVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    // Загружаем средний рейтинг товара
    if (item && dev.id) {
      item.fetchItemAverageRating(dev.id).then(() => {
        setAverageRating(item.averageRating);
      });
    }
  }, [dev.id, item]);

  const deleteItemItem = (id) => {
    deleteItem(id).then(() => {
      getItems(null, null, 1, 100).then((data) => {
        item.setItems(data.rows);
        item.setTotalCount(data.count);
      });
    });
  };

  const editItemItem = (id) => {
    setEditItemVisible(true);
    console.log(id, "id устройства, изменение");
  };

  const addToCart = async (item) => {
    if (!user.isAuth) {
      toast.info("Чтобы добавить товары в корзину, пожалуйста, авторизуйтесь!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    if (user.role === "ADMIN") {
      toast.info("Админ не может добавлять товары в корзину, авторизуйтесь как пользователь!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    // Проверка: если товар уже в корзине
    const isItemInCart = cart.cart.some(cartItem => cartItem.id === item.id);
    if (isItemInCart) {
      toast.info("Товар уже в корзине!", {
        position: "top-center",
        autoClose: 3000,
      });
      alert("Товар уже в корзине !");
      return;
    }
  
    try {
      if (user.role === "USER") {
        const response = await addToBasket(item.id); // Отправляем запрос на сервер
        toast.success(response.message || "Товар добавлен в корзину!", {
          position: "top-center",
          autoClose: 3000,
        });
        cart.addOne(item); // Локальное обновление корзины
        cart.setQuantityCartItems();
        localStorage.setItem("cartItems", JSON.stringify(cart.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при добавлении товара в корзину.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <>
      <div className="card__product">
        <div className="card__top">
          <NavLink to={ITEM_ROUTE + "/" + dev.id} className="card__image">
            <img src={process.env.REACT_APP_API_URL + dev.img} alt={dev.name} />
          </NavLink>
          <div className="card__label">{brandName.name}</div>
        </div>
        <div className="card__bottom">
          <div className="card__prices">
            <div className="card__price card__price--common">{dev.price}</div>
            
          </div>
          {averageRating !== null && (
              <div className="card__rating">
                <span>{averageRating.toFixed(1)} ⭐</span>
              </div>
            )}
          <NavLink to={ITEM_ROUTE + "/" + dev.id} className="card__title">
            {dev.name}
          </NavLink>

          {/* Если товара нет в наличии, показываем сообщение и блокируем кнопку */}
          {dev.availability === "нет в наличии" ? (
            <div className="out-of-stock-message">
              Извините, в данный момент товара нет в наличии.
            </div>
          ) : (
            <button className="card__add" onClick={() => addToCart(dev)}>
              В корзину{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-cart4"
                viewBox="0 0 16 16"
              >
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
              </svg>
            </button>
          )}


          {user.role === "ADMIN" && (
            <Card.Footer className="d-flex justify-content-between align-items-end">
              <Button
                onClick={() => setDeleteItemVisible(true)}
                className="m-1"
                size="sm"
                variant="danger"
              >
                Удалить
              </Button>
              <Button
                onClick={() => editItemItem(dev.id)}
                className="m-1"
                size="sm"
                variant="warning"
              >
                Изменить
              </Button>
            </Card.Footer>
          )}
        </div>
      </div>
      <DeleteItem
        show={deleteItemVisible}
        onHide={() => setDeleteItemVisible(false)}
        onDelete={() => deleteItemItem(dev.id)}
        brandName={brandName.name}
        devName={dev.name}
      />
      <EditItem
        show={editItemVisible}
        onHide={() => setEditItemVisible(false)}
        onEdit={() => editItemItem(dev.id)}
        devId={dev.id}
        devName={dev.name}
        devPrice={dev.price}
      />
    </>
  );
};

export default ItemItem;
