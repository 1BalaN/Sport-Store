import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import insideImage from "../sliderAbout/background.png";
import outsideImage from "../sliderAbout/outsideImg.jpg";
import kassa from "../sliderAbout/kassa.jpg";

const AboutUs = () => {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>О магазине Спорт Сити</h1>
          <p>
            "Спорт Сити" – это современный магазин спортивных товаров, который
            предлагает широкий ассортимент продукции для активного образа жизни.
            Мы специализируемся на одежде, обуви и спортивном инвентаре для всех
            видов спорта. Наша миссия – поддерживать вас на пути к здоровому и
            активному образу жизни!
          </p>
          <p>
            Посетите наши магазины или делайте покупки онлайн, чтобы найти всё
            необходимое для вашего спорта.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100 slider-image"
                src={insideImage}
                alt="Зона с товаром"
              />
              <div className="carousel-caption-container">
                <h3>Зона с товаром</h3>
                <p>Стильная и функциональная одежда для всех.</p>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100 slider-image"
                src={outsideImage}
                alt="Фасад магазина"
              />
              <div className="carousel-caption-container">
                <h3>Фасад магазина</h3>
                <p>Современный дизайн и удобное расположение.</p>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100 slider-image"
                src={kassa}
                alt="Кассы"
              />
              <div className="carousel-caption-container">
                <h3>Кассы</h3>
                <p>Быстрая и качественная работа сотрудников</p>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      {/* Добавляем CSS для слайдера и текста */}
      <style>
        {`
          .slider-image {
            height: 400px; /* Задаем фиксированную высоту */
            object-fit: cover; /* Изображение будет заполнять контейнер с сохранением пропорций */
          }

          .carousel-caption-container {
            position: absolute;
            bottom: 20px; /* Отступ снизу */
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: white;
            background: rgba(0, 0, 0, 0.5); /* Немного затемняем фон под текстом */
            padding: 10px;
            width: 100%;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .carousel-caption-container h3 {
            margin: 0;
            font-size: 24px;
            margin-bottom: 10px; /* Отступ снизу между заголовком и текстом */
          }

          .carousel-caption-container p {
            margin: 0;
            font-size: 16px;
          }
        `}
      </style>
    </Container>
  );
};

export default AboutUs;
