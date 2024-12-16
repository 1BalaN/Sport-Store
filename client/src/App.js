import { observer } from "mobx-react-lite";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import { check } from "./http/userApi";
import { BrowserRouter } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AdminNavBar from "./components/AdminNavBar";
import UnAuthorizedNavBar from "./components/UnAuthorizedNavBar";
import UserNavBar from "./components/UserNavBar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = observer(() => {
  const { user } = useContext(Context);
  const [isLoading, setIsLoasding] = useState(true);

  useEffect(() => {
    try {
      check()
        .then((data) => {
          if (!data) {
            console.log("пользователь не авторизован");
          } else {
            user.setUser(data);
            user.setIsAuth(true);
            user.setRole(data.role);
          }
        })
        .finally(() => setIsLoasding(false));
    } catch (e) {
      console.log(e, "Ошибка данных");
    }
  }, [user]);

  if (isLoading) {
    return <Spinner animation="grow" />;
  }

  if (user.role === "ADMIN") {
    return (
      <BrowserRouter>
        <AdminNavBar />
        <AppRouter />
        <Footer/>
        <ToastContainer/>
      </BrowserRouter>
    );
  } else if (user.role === "USER") {
    return (
      <BrowserRouter>
        <UserNavBar />
        <AppRouter />
        <Footer/>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <UnAuthorizedNavBar />
        <AppRouter />
        <Footer/>
        <ToastContainer/>
      </BrowserRouter>
    );
  }
});

export default App;
