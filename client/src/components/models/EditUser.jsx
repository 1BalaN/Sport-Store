import React, { useState, useEffect } from "react";
import { Modal, Button, Form, FormControl, Alert } from "react-bootstrap";
import { updatePhone } from "../../http/userApi"; // Импортируем API для обновления телефона

const EditUser = ({ show, onHide, currentPhone }) => {
    const [phone, setPhone] = useState(currentPhone); // Локальное состояние для номера телефона
    const [error, setError] = useState(""); // Для ошибок
    const [success, setSuccess] = useState(""); // Для сообщения об успехе

    // Валидация номера телефона
    const validatePhone = () => {
        const phonePattern = /^\+375[0-9]{9}$/;
        if (!phone || !phone.match(phonePattern)) {
            setError("Номер телефона должен начинаться с +375 и содержать 9 цифр.");
            return false;
        }
        setError("");
        return true;
    };

    // Обработчик сохранения
    const handleSave = async () => {
        if (!validatePhone()) return;

        try {
            await updatePhone(phone); // Отправка запроса на сервер
            setSuccess("Номер телефона успешно обновлен!"); // Сообщение об успехе
            setTimeout(() => setSuccess(""), 3000); // Убираем сообщение об успехе через 3 секунды
            onHide(); // Закрытие модального окна
        } catch (e) {
            setError("Ошибка при обновлении номера телефона. Попробуйте еще раз.");
        }
    };

    // Сброс полей при закрытии
    const handleCancel = () => {
        setPhone(currentPhone); // Возвращаем первоначальное значение
        setError(""); // Сбрасываем ошибки
        onHide(); // Закрываем модальное окно
    };

    useEffect(() => {
        setPhone(currentPhone); // Обновляем локальное состояние при изменении `currentPhone`
    }, [currentPhone]);

    return (
        <Modal show={show} onHide={handleCancel} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Изменение номера телефона</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {error && <Alert variant="danger">{error}</Alert>} {/* Отображение ошибки */}
                    {success && <Alert variant="success">{success}</Alert>} {/* Отображение успеха */}
                    <Form.Label>Введите новый номер телефона</Form.Label>
                    <FormControl
                        value={phone}
                        className="mt-3"
                        placeholder="+375XXXXXXXXX"
                        onChange={(e) => setPhone(e.target.value)} // Обновляем состояние номера
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleCancel}>
                    Отмена
                </Button>
                <Button variant="outline-success" onClick={handleSave}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUser;
