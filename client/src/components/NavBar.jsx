import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Context } from "..";
import { NavLink, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, } from "../utils/consts";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
  const { item, cart, user } = useContext(Context);
  const navigate = useNavigate();

  const clearFilter = () => {
    item.setSelectedType({});
    item.setSelectedBrand({});
  };

  const goToAdminPage = () => {
    navigate(ADMIN_ROUTE);
    item.setSelectedType({});
    item.setSelectedBrand({});
  };
  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setRole("");
    localStorage.removeItem("token");
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink
          to={SHOP_ROUTE}
          onClick={clearFilter}
          style={{ textDecoration: "none", color: "black" }}
        >
          {/* <img src="/logo.png" alt="Logo" /> */}
        </NavLink>
        {user.isAuth ? (
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
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.quantityCartItems}
              </span>
            </Button>
            <Button
              className="m-1"
              variant={"outline-dark"}
              onClick={goToAdminPage}
            >
              Админ Доступ
            </Button>
            <Button
              className="m-1"
              variant={"outline-dark"}
              onClick={() => logOut()}
            >
              Выйти
            </Button>
          </Nav>
        ) : (
          <Nav className="ml-auto my-2 my-lg-0" style={{ maxHeight: "100px" }}>
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
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.quantityCartItems}
              </span>
            </Button>
            <Button
              variant={"outline-dark"}
              onClick={() => navigate(LOGIN_ROUTE)}
            >
              Авторизация
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});

export default NavBar;
