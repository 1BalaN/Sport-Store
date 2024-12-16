import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Shop from "../pages/Shop";
import AdminPage from "../pages/AdminPage";
import Basket from "../pages/Basket";
import Auth from "../pages/Auth";
import {ABOUTUS_ROUTE, ADMIN_ROUTE, BASKET_ROUTE, ITEM_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, USER_ROUTE, CONTACTUS_ROUTE, BASKETHISTORY_ROUTE, ADMINODERS_ROUTE } from "../utils/consts";
import ItemPage from "../pages/ItemPage";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import UserPage from "../pages/UserPage";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import OrderHistory from "../pages/OrderHistory";
import AdminOrders from "../pages/AdminOrders";

const AppRouter = observer(() => {
  const {user} = useContext(Context)
  return (
    <>
      {user.role === 'ADMIN' ? (
        <Routes>
          <Route path={ADMIN_ROUTE} element={<AdminPage />} />
          <Route path={BASKET_ROUTE} element={<Basket />} />
          <Route path={SHOP_ROUTE} element={<Shop />} />
          <Route path={LOGIN_ROUTE} element={<Auth />} />
          <Route path={REGISTRATION_ROUTE} element={<Auth />} />
          <Route path={ITEM_ROUTE + "/:id"} element={<ItemPage />} />
          <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
          <Route path={ABOUTUS_ROUTE} element={<AboutUs />} />
          <Route path={CONTACTUS_ROUTE} element={<ContactUs />} />
          <Route path={ADMINODERS_ROUTE} element={<AdminOrders />} />
        </Routes>
      ) : user.role === 'USER' ? (
        <Routes>
          <Route path={SHOP_ROUTE} element={<Shop />} />
          <Route path={BASKET_ROUTE} element={<Basket />} />
          <Route path={LOGIN_ROUTE} element={<Auth />} />
          <Route path={REGISTRATION_ROUTE} element={<Auth />} />
          <Route path={USER_ROUTE} element={<UserPage />} />
          <Route path={ITEM_ROUTE + "/:id"} element={<ItemPage />} />
          <Route path={ADMIN_ROUTE} element={<Auth/>} />
          <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
          <Route path={ABOUTUS_ROUTE} element={<AboutUs />} />
          <Route path={CONTACTUS_ROUTE} element={<ContactUs />} />
          <Route path={BASKETHISTORY_ROUTE} element={<OrderHistory />} />
        </Routes>
      ) : <Routes>
      <Route path={SHOP_ROUTE} element={<Shop />} />
      <Route path={BASKET_ROUTE} element={<Basket />} />
      <Route path={LOGIN_ROUTE} element={<Auth />} />
      <Route path={REGISTRATION_ROUTE} element={<Auth />} />
      <Route path={USER_ROUTE} element={<Navigate to={LOGIN_ROUTE} replace/>} />
      <Route path={ITEM_ROUTE + "/:id"} element={<ItemPage />} />
      <Route path={ADMIN_ROUTE} element={<Auth/>} />
      <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
      <Route path={ABOUTUS_ROUTE} element={<AboutUs />} />
      <Route path={CONTACTUS_ROUTE} element={<ContactUs />} />
    </Routes>}
    </>
  );
});

export default AppRouter;
