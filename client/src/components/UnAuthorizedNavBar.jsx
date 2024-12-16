import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Context } from "..";
import { NavLink, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, SHOP_ROUTE, ABOUTUS_ROUTE, CONTACTUS_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const UnAuthorizedNavBar = observer(() => {
  const { item } = useContext(Context);
  const navigate = useNavigate();

  const clearFilter = () => {
    item.setSelectedType({});
    item.setSelectedBrand({});
  };

  return (
    <Navbar expand="lg" style={{ background: '#FF4500' }} className="mb-4">
      <Container className="d-flex justify-content-between align-items-center">
        <NavLink
          to={SHOP_ROUTE}
          onClick={clearFilter}
          style={{ textDecoration: "none", color: "black" }}
        >
          <img src="/logo.png" alt="Логотип" style={{ width: '100px', height: '50px' }} />
        </NavLink>
        
        <Nav className="d-flex justify-content-center">
          <Nav.Link
            onClick={() => navigate(SHOP_ROUTE)}
            className="nav-button"
            style={{
              cursor: 'pointer',
              color: '#212529',
              fontSize: '18px',
              textDecoration: 'none',
            }}
          >
            Главная
          </Nav.Link>
          <Nav.Link
            onClick={() => navigate(ABOUTUS_ROUTE)}
            className="nav-button"
            style={{
              cursor: 'pointer',
              color: '#212529',
              fontSize: '18px',
              textDecoration: 'none',
            }}
          >
            О нас
          </Nav.Link>
          <Nav.Link
            onClick={() => navigate(CONTACTUS_ROUTE)}
            className="nav-button"
            style={{
              cursor: 'pointer',
              color: '#212529',
              fontSize: '18px',
              textDecoration: 'none',
            }}
          >
            Контакты
          </Nav.Link>
        </Nav>

        <Button
          variant="outline-dark"
          onClick={() => navigate(LOGIN_ROUTE)}
          className="ml-2"
        >
          Авторизация
        </Button>
      </Container>

      <style>
        {`
          .nav-button {
            position: relative;
          }
          .nav-button:hover {
            text-decoration: none;
          }
          .nav-button::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #212529;
            transition: width 0.3s ease-in-out;
          }
          .nav-button:hover::after {
            width: 100%;
          }
        `}
      </style>
    </Navbar>
  );
});

export default UnAuthorizedNavBar;
