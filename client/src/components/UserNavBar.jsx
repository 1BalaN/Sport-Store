import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Context } from "..";
import { NavLink, useNavigate } from "react-router-dom";
import { BASKET_ROUTE, SHOP_ROUTE, USER_ROUTE, ABOUTUS_ROUTE, CONTACTUS_ROUTE, BASKETHISTORY_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { FiLogOut } from "react-icons/fi";

const UserNavBar = observer(() => {
  const { item, cart, user } = useContext(Context);
  const navigate = useNavigate();

  const clearFilter = () => {
    item.setSelectedType({});
    item.setSelectedBrand({});
  };

  const goToUserPage = () => {
    navigate(USER_ROUTE);
  };
  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setRole(null);
    localStorage.removeItem("token");
  };
  return (
    <Navbar expand="lg" style={{background: '#FF4500'}} className="mb-4">
      <Container>
        <NavLink
          to={SHOP_ROUTE}
          onClick={clearFilter}
          style={{ textDecoration: "none", color: "black" }}
        >
          <img src="/logo.png" alt="Логотип" style={{width:'100px', height:'50px'}} />
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
          <Nav.Link
            onClick={() => navigate(BASKETHISTORY_ROUTE)}
            className="nav-button"
            style={{
              cursor: "pointer",
              color: "#212529",
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            Мои заказы
          </Nav.Link>
        </Nav>
          <Nav className=" my-lg-0" style={{ maxHeight: "100px" }}>
            <Button
              className="m-1 mx-5  position-relative d-flex align-items-center"
              variant={"outline-primary"}
              onClick={() => navigate(BASKET_ROUTE)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cart4"
                viewBox="0 0 16 16"
              >
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
              </svg>
              {cart.quantityCartItems > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.quantityCartItems}
              </span>}
            
            </Button>

            <Button
              className="m-1"
              variant={"outline-dark"}
              onClick={goToUserPage}
            >
              Личный кабинет
            </Button>
            <Button
              className="m-1"
              variant={"outline-dark"}
              onClick={() => logOut()}
            >
              <FiLogOut size={20} /> {/* Иконка выхода */}
            </Button>
          </Nav>
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

export default UserNavBar;
