import React, { useContext, useEffect, useState } from "react";
import "./cards.css";
import "../components/cart.css";
import CartItem from "../components/CartItem";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { checkout, clearBasket } from "../http/basketApi";
import { BASKETHISTORY_ROUTE } from "../utils/consts";

const Basket = observer(() => {
    const { cart } = useContext(Context);
    const navigate = useNavigate();
    
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [phone, setPhone] = useState("");

    const clearCart = async () => {
        try {
            await clearBasket(); // Очистка корзины на сервере
            cart.clearCart(); // Очистка локального состояния
            cart.setQuantityCartItems();
            localStorage.setItem("cartItems", JSON.stringify(cart.cart));
            // alert("Корзина успешно очищена.");
        } catch (error) {
            console.error("Ошибка при очистке корзины:", error.message);
            alert("Не удалось очистить корзину. Попробуйте снова.");
        }
    };

    const handleCheckout = async () => {
        try {
            if (!address.trim()) {
                alert("Пожалуйста, укажите адрес для доставки.");
                return;
            }

            const phonePattern = /^\+375[0-9]{9}$/;

            if(!phone.trim()) {
                alert("Пожалуйста, укажите номер телефона");
                return;
            }

            if (!phone.match(phonePattern)) {
                alert("Неверный формат номера телефона! Номер должен начинаться с +375 и содержать 12 цифр.");
                return;
            }

            await checkout(address, paymentMethod, phone); // Передаем адрес и способ оплаты
            clearCart();
            alert("Заказ успешно оформлен!");
            navigate(BASKETHISTORY_ROUTE);
        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error.response?.data || error.message);
            alert("Ошибка при оформлении заказа. Попробуйте снова.");
        }
    };

    useEffect(() => {
        if (localStorage) {
            cart.setCart(JSON.parse(localStorage.getItem("cartItems")));
            cart.setQuantityCartItems();
        }
    }, []);

    const totalPrice = cart.getTotalPrice();

    return (
        <div className="shopping-cart" style={{ border: "1px solid black" }}>
            <div className="attention" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <h3 style={{ marginRight: "10px" }}>Внимание:</h3>
                <p style={{ fontSize: "18px" }}>Оплата осуществляется при получении товара!</p>
            </div>
            <div className="title">{cart.cart?.length === 0 ? "Корзина пуста" : "Товары:"}</div>
            {cart.cart?.map((item) => (
                <CartItem key={item.id} {...item} />
            ))}
            {cart.cart?.length > 0 && (
                <>
                    <h3 style={{ margin: "25px" }}>Итого: {totalPrice} руб.</h3>
                    <div className="order-details">
                        <div className="form-group">
                            <label htmlFor="address" className="form-label">
                                Адрес доставки:
                            </label>
                            <input
                                type="text"
                                id="address"
                                placeholder="Введите адрес доставки"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Номер телефона:
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Введите номер телефона"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Способ оплаты:</label>
                            <div className="payment-methods">
                                <label className="payment-method">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Наличными
                                </label>
                                <label className="payment-method">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Картой
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="buttons-container">
                        <button className="cart__clear" onClick={clearCart}>Очистить корзину</button>
                        <button className="cart__confirm" onClick={handleCheckout}>Подтвердить заказ</button>
                    </div>
                </>
            )}
        </div>
    );
});

export default Basket;
