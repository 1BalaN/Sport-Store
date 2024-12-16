import React, { useContext, useEffect, useState } from 'react';
import { Container, Col, Image, Row, Card, Button, Form } from 'react-bootstrap';
import { getOneItem } from '../http/itemApi';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { toast } from "react-toastify";
import { addToBasket } from '../http/basketApi';

const ItemPage = () => {
    const { user, cart, item } = useContext(Context);
    const [items, setItems] = useState({ info: [] });
    const { id } = useParams();
    const [userRating, setUserRating] = useState(null);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [userHasRated, setUserHasRated] = useState(false); // Для проверки, оставил ли пользователь оценку
    const [isInCartMessage, setIsInCartMessage] = useState(false);

    useEffect(() => {
        getOneItem(id).then(data => setItems(data));
        item.fetchItemAverageRating(id);
        
        if (user.isAuth) {
            item.fetchUserRating(id).then((rating) => {
                if (rating) {
                    setUserRating(rating);
                    setUserHasRated(true); // Если пользователь уже оставил оценку
                }
            });
        }
    }, [id, user.isAuth, item]);

    const handleRatingChange = (e) => {
        let value = e.target.value;
    
        value = value.replace(',', '.');
        
        if (/^(\d+(\.\d*)?|\.\d*)?$/.test(value)) {
           
            const parsedValue = parseFloat(value);
            if (parsedValue >= 0 && parsedValue <= 5) {
                setUserRating(value); // Сохраняем текущее значение
            } else if (parsedValue > 5) {
                toast.warning("Рейтинг не может быть больше 5!", {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                setUserRating(''); // Сбрасываем, если число становится некорректным
            }
        } else {
            toast.warning("Введите корректное число (0-5)!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };
    
    

    const submitRating = async () => {
        if (!user.isAuth) {
            toast.info("Чтобы оставить оценку, пожалуйста, авторизуйтесь!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (user.role !== "USER") {
            toast.info("Только пользователи с ролью 'USER' могут оставлять оценки!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (userHasRated) {
            toast.info("Вы уже оставили оценку для этого товара.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (userRating === null || userRating < 0 || userRating > 5) {
            toast.error("Оценка должна быть в диапазоне от 0 до 5.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        try {
            await item.submitRating(id, userRating);
            toast.success("Оценка успешно отправлена!", {
                position: "top-center",
                autoClose: 3000,
            });
            setRatingSubmitted(true);
            setUserHasRated(true); // Обновляем состояние, чтобы предотвратить повторные оценки
        } catch (error) {
            console.error(error);
            toast.error(item.ratingError || "Ошибка при отправке оценки.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
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

        if (item.availability === "нет в наличии") {
            toast.error("Извините, товар в данный момент нет в наличии.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

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
              cart.addOne(item); 
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
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image style={{ objectFit: 'cover' }} width={300} src={process.env.REACT_APP_API_URL + items.img} />
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                       
                    </Row>
                </Col>
                <Col md={4} className="mb-4">
                    <Card
                        className="d-flex flex-column align-items-center justify-content-between p-3"
                        style={{
                            width: '100%',
                            height: 180,
                            fontSize: '20px',
                            borderRadius: '10px',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#FF4500',
                            overflow: 'hidden',
                        }}
                    >
                        <h3 style={{ fontWeight: 'bold', color: '#fff', fontSize: '24px' }}>От: {items.price} руб.</h3>
                        <h4 style={{ fontWeight: 'bold', color: '#fff', fontSize: '20px' }} >
                            {items.availability === "в наличии" ? "В наличии" : "Нет в наличии"}
                        </h4>
                        <Button
                            variant={'outline-light'}
                            style={{
                                width: '80%',
                                backgroundColor: '#fff',
                                color: '#FF4500',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                padding: '10px 15px',
                                transition: 'background-color 0.3s linear'
                            }}
                            onClick={() => addToCart(items)}
                            disabled={items.availability === "нет в наличии"}
                        >
                            {items.availability === "в наличии" ? "Добавить в корзину" : "Товар отсутствует"}
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Row className="d-flex flex-column m-3">
                
                <h3>Рейтинг: {item.averageRating ? item.averageRating.toFixed(1) : 'Нет данных'} ⭐</h3>
                {user.isAuth && user.role === "USER" && (
                    <div className="mt-3" style={{ maxWidth: "300px" }}>
                        <h4>Оцените товар:</h4>
                        <Form.Control
                            type="text" 
                            inputMode='decimal'
                            placeholder="Оцените товар (0-5)"
                            value={userRating || ''}
                            onChange={handleRatingChange}
                            disabled={ratingSubmitted || userHasRated}
                            style={{
                            border: '2px solid #FF4500',
                            borderRadius: '5px',
                            padding: '10px',
                            fontSize: '16px',
                            }}
                        />

                        <Button
                            className="mt-3"
                            onClick={submitRating}
                            disabled={ratingSubmitted || userHasRated}
                            style={{
                                backgroundColor: '#FF4500',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                            }}
                        >
                            {ratingSubmitted || userHasRated ? "Оценка отправлена" : "Отправить оценку"}
                        </Button>
                    </div>
                )}
            </Row>

            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {items.info.map((info, index) => (
                    <Card key={info.id} className="mb-3">
                        <Card.Body>
                            <Row>
                                <Col md={4}><strong>{info.title}:</strong></Col>
                                <Col md={8}>{info.description}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </Row>
        </Container>
    );
};

export default ItemPage;
