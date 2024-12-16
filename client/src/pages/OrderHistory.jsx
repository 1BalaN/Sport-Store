import React, { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { getOrderHistory, deleteOrder } from "../http/orderApi";
import "./OrderHistory.css";

const OrderHistory = observer(() => {
    const { user } = useContext(Context);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user.isAuth) {
            getOrderHistory()
                .then((data) => setOrders(data))
                .catch((error) =>
                    console.error("Ошибка при получении истории заказов:", error)
                );
        }
    }, [user.isAuth]);

    const handleDeleteOrder = async (orderId, orderStatus) => {
        if (orderStatus === "Передан курьеру") {
            alert("Для отмены заказа +375298887713");
            return;
        }
        if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
            try {
                await deleteOrder(orderId);
                setOrders(orders.filter((order) => order.id !== orderId));
                alert("Заказ успешно удален.");
            } catch (error) {
                console.error("Ошибка при удалении заказа:", error);
                alert("Ошибка при удалении заказа.");
            }
        }
    };

    const formatDateTime = (dateTime) => {
        const options = { 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
        };
        return new Intl.DateTimeFormat("ru-RU", options).format(new Date(dateTime));
    };

    return (
        <div className="order-history-container">
            <h2 className="page-title">История заказов</h2>
            {orders.length === 0 ? (
                <p className="no-orders-message">У вас пока нет заказов.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-item">
                            <p>
                                <span className="order-label">Заказ №:</span>{" "}
                                {order.id}
                            </p>
                            <p>
                                <span className="order-label">Время создание заказа:</span>{" "}
                                {formatDateTime(order.createdAt)}
                            </p>
                            <p>
                                <span className="order-label">
                                    Общая стоимость:
                                </span>{" "}
                                {order.totalPrice} руб.
                            </p>
                            <p>
                                <span className="order-label">Статус:</span>{" "}
                                {order.status}
                            </p>
                            {order.status === "Отменен" && (<p>
                                <span className="order-label">Причина отмены:</span>{" "}
                                {order.cancellationReason}
                            </p>)}
                            <p>
                                <span className="order-label">Адрес доставки:</span>{" "}
                                {order.address}
                            </p>
                            <p>
                                <span className="order-label">Номер телефона:</span>{" "}
                                {order.phone}
                            </p>
                            <p>
                                <span className="order-label">Способ оплаты:</span>{" "}
                                {order.paymentMethod === "cash" ? "Наличными" : "Картой"}
                            </p>
                            <h4 className="items-title">Товары:</h4>
                            <ul className="order-items-list">
                                {order.items?.map((item) => (
                                    <li key={item.id} className="order-item-detail">
                                        {item.name} - {item.quantity} шт.
                                        ({item.price} руб. за шт.)
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="delete-order-button"
                                onClick={() => handleDeleteOrder(order.id, order.status)}
                            >
                                Удалить заказ
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default OrderHistory;
