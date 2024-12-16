import React, { useContext } from "react";
import { Context } from "..";
import { updateCartItemQuantity, removeFromBasket } from "../http/basketApi"; 

const CartItem = ({ name, price, img, id, quantity }) => {
  const { cart } = useContext(Context);

  // Удаление товара из корзины
  const removeCartItem = async (id) => {
    try {
      await removeFromBasket(id); // Удаляем товар на сервере
      cart.removeOne(id); // Удаляем локально
      cart.setQuantityCartItems();
      localStorage.setItem("cartItems", JSON.stringify(cart.cart));
    } catch (error) {
      console.error("Ошибка при удалении товара:", error.message);
      alert("Не удалось удалить товар. Попробуйте снова.");
    }
  };

  // Увеличение количества товара
  const increaseCartItem = async (id) => {
    if(quantity < 5) {
      try {
        await updateCartItemQuantity(id, quantity + 1); // Обновляем на сервере
        cart.increaseQuantity(id); // Обновляем локально
        cart.setQuantityCartItems();
        localStorage.setItem("cartItems", JSON.stringify(cart.cart));
      } catch (error) {
        console.error("Ошибка при увеличении количества товара:", error.message);
        alert("Не удалось увеличить количество товара. Попробуйте снова.");
      }
    }
    else {
      alert("Одного товара в корзине не должно быть больше 5")
    }
  };

  // Уменьшение количества товара
  const decreaseCartItem = async (id) => {
    if (quantity > 1) {
      try {
        await updateCartItemQuantity(id, quantity - 1); // Обновляем на сервере
        cart.decreaseQuantity(id); // Обновляем локально
        cart.setQuantityCartItems();
        localStorage.setItem("cartItems", JSON.stringify(cart.cart));
      } catch (error) {
        console.error("Ошибка при уменьшении количества товара:", error.message);
        alert("Не удалось уменьшить количество товара. Попробуйте снова.");
      }
    }
  };


  const changeQuantity = async (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 5) {
      try {
        await updateCartItemQuantity(id, newQuantity); // Обновляем на сервере
        cart.updateLocalQuantity(id, newQuantity); // Обновляем локально
        cart.setQuantityCartItems();
        localStorage.setItem("cartItems", JSON.stringify(cart.cart));
      } catch (error) {
        console.error("Ошибка при обновлении количества товара:", error.message);
        alert("Не удалось обновить количество товара. Попробуйте снова.");
      }
    } else {
      alert("Количество должно быть больше нуля.");
    }
  };

  return (
    <div className="item">
      <div className="buttons">
        <span
          className="delete-btn-q"
          onClick={() => removeCartItem(id)}
        ></span>
        {/* <span className="like-btn-q"></span> */}
      </div>
      <div className="item__image-container">
        <div className="item-image">
          <img src={process.env.REACT_APP_API_URL + img} alt={name} />
        </div>
      </div>
      <div className="description">
        <span>{name}</span>
      </div>
      <div className="quantity">
        <button
          className="minus-btn-q"
          disabled={quantity <= 1}
          type="button"
          name="button"
          onClick={() => decreaseCartItem(id)}
        >
          <svg
            width="10px"
            height="10px"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L18 12"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </svg>
        </button>
        <input
          type="number"
          name="name"
          value={quantity}
          onChange={(e) => changeQuantity(e)}
          min={1}
          max={5}
        />
        <button
          className="plus-btn-q"
          type="button"
          name="button"
          onClick={() => increaseCartItem(id)}
        >
          <svg
            fill="currentColor"
            width="10px"
            height="10px"
            viewBox="0 0 45.402 45.402"
          >
            <g>
              <path
                d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
                    c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
                    c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
                    c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"
              />
            </g>
          </svg>
        </button>
      </div>
      <div className="total-price">{price * quantity} BYN</div>
    </div>
  );
};

export default CartItem;
