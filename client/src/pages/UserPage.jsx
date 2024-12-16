import React, { useContext, useState, useEffect } from "react";
import { Context } from "..";
import { Container, Button, Form, Card, Row, Col, Alert } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { updateUserPhone, checkPhoneUniqueness, getUserInfo } from "../http/userApi";

const UserPage = observer(() => {
    const { user } = useContext(Context);
    
    // Стейты для управления состоянием
    const [phone, setPhone] = useState(user.user.phone || '');
    const [isValid, setIsValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null); // Для хранения информации о пользователе
    const [loadingUserInfo, setLoadingUserInfo] = useState(true); // Для отслеживания загрузки данных пользователя
    const [error, setError] = useState(null); // Для ошибок при загрузке данных

    // Загрузка данных о пользователе при монтировании компонента
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(user.user.id); // Получаем информацию о пользователе
                setUserInfo(data); // Устанавливаем данные о пользователе
            } catch (e) {
                setError('Не удалось загрузить данные пользователя');
            } finally {
                setLoadingUserInfo(false);
            }
        };

        fetchUserInfo();
    }, [user.user.id]);

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        setPhoneError('');
        setSuccessMessage('');
    };

    const validatePhone = (phone) => {
        const regex = /^\+375\d{9}$/;
        return regex.test(phone);
    };

    const handleUpdatePhone = async () => {
        if (!validatePhone(phone)) {
            setIsValid(false);
            return;
        }

        try {
            const { unique } = await checkPhoneUniqueness(phone);
            if (!unique) {
                setPhoneError('Этот номер телефона уже используется другим пользователем');
                return;
            }

            setLoading(true);
            await updateUserPhone(user.user.id, phone);
            user.setUser({ ...user.user, phone });
            setIsValid(true);
            setSuccessMessage('Номер телефона успешно обновлен! Обновите страницу');
        } catch (e) {
            setPhoneError(
                e.response?.data?.message || 'Ошибка при обновлении номера телефона'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingUserInfo) {
        return <div>Загрузка данных пользователя...</div>; // Показываем сообщение, пока данные загружаются
    }

    if (error) {
        return <div>{error}</div>; // Показываем ошибку, если она произошла при загрузке
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Профиль пользователя</h2>
                    <Row className="mb-3">
                        <Col md={6}>
                            <h4>Ваш email:</h4>
                            <p>{userInfo.email}</p>
                        </Col>
                        <Col md={6}>
                            <h4>Ваш ID:</h4>
                            <p>{userInfo.id}</p>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <h4>Ваш номер телефона:</h4>
                            <p>{userInfo.phone || 'Телефон не указан'}</p>
                        </Col>
                    </Row>

                    <Form>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Обновить номер телефона</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="+375XXXXXXXXX"
                                value={phone}
                                onChange={handlePhoneChange}
                                isInvalid={!isValid}
                                style={{
                                    borderColor: !isValid ? '#dc3545' : '',
                                    backgroundColor: '#f8f9fa',
                                    boxShadow: 'none',
                                    width: '300px'
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Номер телефона должен начинаться с +375 и содержать 9 цифр.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            onClick={handleUpdatePhone}
                            variant="primary"
                            block
                            disabled={loading}
                            className="mt-3"
                        >
                            {loading ? 'Обновляется...' : 'Обновить телефон'}
                        </Button>
                    </Form>

                    {/* Уведомления об ошибках или успехе */}
                    {phoneError && (
                        <Alert variant="danger" className="mt-3">
                            {phoneError}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert variant="success" className="mt-3">
                            {successMessage}
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
});

export default UserPage;
