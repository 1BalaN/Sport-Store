import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faFacebook, faLinkedin, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>О нас</h5>
            <p>
              Мы предлагаем лучшие товары и услуги для наших клиентов.
              Свяжитесь с нами, если у вас есть вопросы!
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Контакты</h5>
            <ul className="list-unstyled">
              <li>Email: sportcity@gmail.com</li>
              <li>Телефон: +375 (29) 888-77-13</li>
              <li>Адрес: проспект Независимости, 179, г. Минск</li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Социальные сети</h5>
            <ul className="list-unstyled d-flex">
              <li className="me-3">
                <a href="https://telegram.org" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTelegram} size="lg" />
                </a>
              </li>
              <li className="me-3">
                <a href="https://faceebok.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size='lg'/>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} size='lg' />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>&copy; 2024 Все права защищены.</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p> Сайт разработан:    
              <a href="https://by.linkedin.com/in/danik-gormash-204739309" target="_blank" className="text-white ps-2" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>  
            </p>
          </Col>
        </Row>
        <Row >
          <Col className="text-center">
            <p> Код можно будет найти здесь:    
              <a href="https://github.com/1BalaN" target="_blank" className="text-white ps-2" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>  
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
