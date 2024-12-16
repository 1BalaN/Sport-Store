const express = require('express');
const basketController = require('../controllers/basketController')

const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/add', authMiddleware, basketController.addToBasket);  // Добавить товар в корзину
router.put('/update', authMiddleware, basketController.updateBasketItemQuantity);
router.post('/checkout', authMiddleware, basketController.checkout);  // Оформить заказ
router.get('/history', authMiddleware, basketController.getOrderHistory);  // История заказов пользователя
router.get('/admin/all', authMiddleware, checkRole('ADMIN'), basketController.getAllOrders);  // Все заказы (для админа)
router.get('/admin/excel', authMiddleware, checkRole('ADMIN'), basketController.exportAllOrdersToExcel)
router.put('/update-status', authMiddleware, checkRole('ADMIN'), basketController.updateOrderStatus); // Обновление статуса заказа (только для администратора)
router.post('/set-cancellation-reason', authMiddleware, checkRole('ADMIN'), basketController.setOrUpdateCancellationReason); // Добавить или обновить причину отмены заказа (только для администратора)
router.delete('/delete/:orderId', authMiddleware, basketController.deleteOrder); // Удаление заказа
router.delete('/remove/:itemId', authMiddleware, basketController.removeItemFromBasket); // Удаление товара из корзины
router.delete('/clear', authMiddleware, basketController.clearBasket); // Удаление всех товаров из корзины



module.exports = router;