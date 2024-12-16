import React, { useContext, useState } from "react";
import { Container, Form, Card, Button, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { registration, login } from "../http/userApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import "./Auth.css"

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailValidation = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const click = async () => {
    try {
      if (!emailValidation(email)) {
        setError("email должен содержать '@' и '.'");
        return;
      }
      setError(""); // Очистить ошибку, если email валиден

      let data;
      if (isLogin) {
        data = await login(email, password);
        console.log(data, "data");
        user.setUser(data);
      } else {
        data = await registration(email, password);
      }

      user.setIsAuth(true);
      user.setRole(data.role);
      navigate(SHOP_ROUTE);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        height: window.innerHeight - 54,
        
      }}
    >
      <Card
        style={{
          width: 600,
          padding: "30px",
          backgroundColor: "#FF4500", 
          color: "#fff", 
          borderRadius: "12px",
        }}
      >
        <h2 style={{color: "#212529"}} className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column mt-3">
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 input-field"
            placeholder="Введите ваш email"
            style={{
              backgroundColor: "#fff", 
              color: "#212529", 
              border: "2px solid #FF4500",
              borderRadius: "6px",
            }}
          />
          {error && (
            <div style={{ color: "#212529", fontSize: "14px" }}>{error}</div>
          )}
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-2 input-field"
            placeholder="Введите ваш пароль"
            style={{
              backgroundColor: "#fff",
              color: "#212529",
              border: "2px solid #FF4500",
              borderRadius: "6px",
            }}
          />
          <Row className="d-flex justify-content-between mt-3">
            {isLogin ? (
              <div>
                Нет аккаунта?{" "}
                <NavLink to={REGISTRATION_ROUTE} style={{ color: "#212529" }}>
                  Регистрация
                </NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт?{" "}
                <NavLink to={LOGIN_ROUTE} style={{ color: "#212529" }}>
                  Вход
                </NavLink>
              </div>
            )}
            <Button
              className="mt-3 align-self-end"
              variant="outline-light"
              style={{
                borderColor: "#fff",
                color: "#212529",
              }}
              onClick={click}
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
