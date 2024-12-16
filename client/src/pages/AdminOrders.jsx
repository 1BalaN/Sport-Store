import React, { useEffect, useState } from "react";
import { getAllOrders, deleteOrder, updateOrderStatus, setCancellationReason } from "../http/orderApi";
import "./OrderHistory.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [cancellationReason, setCancellationReasonInput] = useState({}); // Локальное состояние для ввода

    useEffect(() => {
        getAllOrders()
            .then((data) => {
                console.log("Полученные заказы:", data); // Отладка
                setOrders(data);
            })
            .catch((error) =>
                console.error("Ошибка при получении всех заказов:", error)
            );
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert("Статус заказа успешно обновлен.");
        } catch (error) {
            console.error("Ошибка при обновлении статуса заказа:", error);
            alert("Не удалось обновить статус заказа.");
        }
    };

    const handleSaveCancellationReason = async (orderId) => {
        const reason = cancellationReason[orderId];
        if (!reason) {
            alert("Введите причину отмены перед сохранением.");
            return;
        }
        try {
            await setCancellationReason(orderId, reason);
            setOrders(
                orders.map((order) =>
                    order.id === orderId
                        ? { ...order, cancellationReason: reason }
                        : order
                )
            );
            alert("Причина отмены успешно сохранена.");
        } catch (error) {
            console.error("Ошибка при установке причины отмены:", error);
            alert("Не удалось сохранить причину отмены.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
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
        <div className="admin-orders-container">
            <h2 className="page-title">Все заказы</h2>
            {orders.length === 0 ? (
                <p className="no-orders-message">Нет заказов.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-item">
                            <p>
                                <span className="order-label">Заказ №:</span> {order.id}
                            </p>
                            <p>
                                <span className="order-label">Время создание заказа:</span>{" "}
                                {formatDateTime(order.createdAt)}
                            </p>
                            <p>
                                <span className="order-label">Заказчик: </span> {order.email}
                            </p>
                            <p>
                                <span className="order-label">Статус:</span>{" "}
                                <select
                                    value={order.status}
                                    onChange={(e) => 
                                        order.status !== "Возврат" && order.status !=="Выполнен" && order.status !== "Отменен" && handleStatusChange(order.id, e.target.value)
                                    }
                                    disabled={order.status === "Отменен" || order.status === "Выполнен" || order.status === "Возврат"}
                                >
                                    <option value="В обработке">В обработке</option>
                                    <option value="Принят">Принят</option>
                                    <option value="Передан курьеру">Передан курьеру</option>
                                    <option value="Выполнен">Выполнен</option>
                                    <option value="Возврат">Возврат</option>
                                    <option value="Отменен">Отменен</option>
                                </select>
                            </p>
                            {order.status === "Отменен" && (
                                <>
                                    <p>
                                        <span className="order-label">Причина отмены:</span>{" "}
                                        {order.cancellationReason || "Причина не указана"}
                                    </p>
                                    <div className="cancellation-reason-container">
                                        <textarea
                                            className="cancellation-reason-input"
                                            placeholder="Введите причину отмены"
                                            value={cancellationReason[order.id] || ""}
                                            onChange={(e) =>
                                                setCancellationReasonInput({
                                                    ...cancellationReason,
                                                    [order.id]: e.target.value,
                                                })
                                            }
                                        />
                                        <button
                                            className="save-cancellation-reason-button"
                                            onClick={() => handleSaveCancellationReason(order.id)}
                                        >
                                            Сохранить причину
                                        </button>
                                    </div>
                                </>
                            )}
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
                                        {item.name} - {item.quantity} шт. ({item.price} руб.
                                        за шт.)
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="delete-order-button"
                                onClick={() => handleDeleteOrder(order.id)}
                            >
                                Удалить заказ
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminOrders;
