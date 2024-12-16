import AdminPage from "./pages/AdminPage"
import Auth from "./pages/Auth"
import Basket from "./pages/Basket"
import ItemPage from "./pages/ItemPagePage"
import Shop from "./pages/Shop"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import OrderHistory from "./pages/OrderHistory"
import AdminOrders from "./pages/AdminOrders"
import { ADMIN_ROUTE, BASKET_ROUTE, ITEM_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, ABOUTUS_ROUTE, CONTACTUS_ROUTE, BASKETHISTORY_ROUTE, ADMINODERS_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: AdminPage
    },
    {
        path: BASKET_ROUTE,
        component: Basket
    },
    {
        path: BASKETHISTORY_ROUTE,
        component: OrderHistory
    },
    {
        path: ADMINODERS_ROUTE,
        component: AdminOrders
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        component: Shop,
    },
    {
        path: LOGIN_ROUTE,
        component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        component: Auth
    },
    {
        path: ITEM_ROUTE + '/:id',
        component: ItemPage
    },
    {
        path: ABOUTUS_ROUTE,
        component: AboutUs
    },
    {
        path: CONTACTUS_ROUTE,
        component: ContactUs
    },
]