const ExcelJS = require('exceljs');
const { Basket, BasketItem, Item, Order, OrderItem, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    // Метод для добавления товара в корзину
    async addToBasket(req, res) {
        try {
            const { itemId, quantity } = req.body;
            const userId = req.user.id;
    
            let userBasket = await Basket.findOne({ where: { userId } });
            if (!userBasket) {
                userBasket = await Basket.create({ userId });
            }
    
            const item = await Item.findByPk(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Товар не найден' });
            }
    
            const existingItem = await BasketItem.findOne({
                where: { basketId: userBasket.id, itemId },
            });
    
            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();
            } else {
                await BasketItem.create({
                    basketId: userBasket.id,
                    itemId,
                    quantity,
                });
            }
    
            return res.status(200).json({ message: 'Товар добавлен в корзину' });
        } catch (error) {
            console.error("Ошибка в addToBasket:", error);
            return res.status(500).json({ message: 'Ошибка добавления товара в корзину' });
        }
    }
    
    // Обновление количества товара в корзине
async updateBasketItemQuantity(req, res) {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user.id;

        if (!itemId || quantity < 0) {
            return res.status(400).json({ message: 'Некорректные данные' });
        }

        const userBasket = await Basket.findOne({ where: { userId } });
        if (!userBasket) {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }

        const basketItem = await BasketItem.findOne({
            where: { basketId: userBasket.id, itemId },
        });

        if (!basketItem) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        if (quantity === 0) {
            // Удаляем товар, если количество становится 0
            await basketItem.destroy();
        } else {
            // Обновляем количество
            basketItem.quantity = quantity;
            await basketItem.save();
        }

        return res.status(200).json({ message: 'Количество товара обновлено' });
    } catch (error) {
        console.error("Ошибка при обновлении количества товара:", error);
        return res.status(500).json({ message: 'Ошибка обновления количества товара' });
    }
}


    // Метод оформления заказа
async checkout(req, res) {
    try {
        const { address, paymentMethod, phone } = req.body; // Получаем адрес и способ оплаты из запроса
        const userId = req.user.id;

        if (!address || !paymentMethod || !phone) {
            return res.status(400).json({ message: 'Адрес, способ оплаты и телефон обязательны' });
        }

        const userBasket = await Basket.findOne({ where: { userId } });
        if (!userBasket) {
            return res.status(400).json({ message: 'Корзина не найдена' });
        }

        const basketItems = await BasketItem.findAll({
            where: { basketId: userBasket.id },
            include: [{ model: Item }],
        });

        if (basketItems.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }

        let totalPrice = 0;
        basketItems.forEach(basketItem => {
            const price = parseInt(basketItem.item?.price);
            if (!isNaN(price) && price > 0) {
                totalPrice += basketItem.quantity * price;
            }
        });

        if (totalPrice <= 0) {
            return res.status(400).json({ message: 'Неверная стоимость заказа' });
        }

        // Создаем заказ
        const order = await Order.create({
            userId,
            totalPrice,
            address,
            paymentMethod,
            phone,
            status: 'В обработке',
        });

        for (const basketItem of basketItems) {
            await OrderItem.create({
                orderId: order.id,
                itemId: basketItem.itemId,
                quantity: basketItem.quantity,
                price: basketItem.item.price,
            });
        }

        await BasketItem.destroy({ where: { basketId: userBasket.id } });

        return res.status(200).json({ message: 'Заказ оформлен', orderId: order.id });
    } catch (error) {
        console.error("Ошибка в методе checkout:", error);
        return res.status(500).json({ message: 'Ошибка оформления заказа' });
    }
}

    

    // Метод для получения истории заказов
    async getOrderHistory(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        include: [Item],
                    },
                ],
            });
    
            return res.json(orders.map(order => ({
                id: order.id,
                status: order.status,
                totalPrice: order.totalPrice,
                address: order.address,
                paymentMethod: order.paymentMethod,
                phone: order.phone,
                createdAt: order.createdAt,
                cancellationReason: order.cancellationReason || null,
                items: order.order_items.map(item => ({
                    id: item.item.id,
                    name: item.item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            })));
        } catch (error) {
            console.error("Ошибка при получении истории заказов:", error);
            return res.status(500).json({ message: 'Ошибка получения истории заказов' });
        }
    }
    

    // Метод для получения всех заказов (для админа)
    async getAllOrders(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Доступ запрещён' });
            }
    
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [Item],
                    },
                    {
                        model: User,
                        attributes: ['email'],
                    },
                ],
            });
    
            return res.json(orders.map(order => ({
                id: order.id,
                userId: order.userId,
                email: order.user.email,
                status: order.status,
                totalPrice: order.totalPrice,
                address: order.address,
                paymentMethod: order.paymentMethod,
                phone: order.phone,
                createdAt: order.createdAt, // Время оформления заказа
                cancellationReason: order.cancellationReason, // Причина отмены заказа
                items: order.order_items.map(item => ({
                    id: item.item.id,
                    name: item.item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            })));
        } catch (error) {
            console.error("Ошибка при получении всех заказов:", error);
            return res.status(500).json({ message: 'Ошибка получения всех заказов' });
        }
    }

    async exportAllOrdersToExcel(req, res) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Доступ запрещён' });
            }
    
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [Item],
                    },
                    {
                        model: User,
                        attributes: ['email'],
                    },
                ],
            });
    
            // Создаём новый workbook и worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Orders');
    
            // Добавляем заголовки
            worksheet.columns = [
                { header: 'Order ID', key: 'id', width: 10 },
                { header: 'User ID', key: 'userId', width: 10 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Total Price', key: 'totalPrice', width: 15 },
                { header: 'Address', key: 'address', width: 30 },
                { header: 'Payment Method', key: 'paymentMethod', width: 20 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'Created At', key: 'createdAt', width: 20 },
                { header: 'Cancellation Reason', key: 'cancellationReason', width: 30 },
                { header: 'Items', key: 'items', width: 50 },
            ];
    
            // Заполняем строки данными
            orders.forEach(order => {
                worksheet.addRow({
                    id: order.id,
                    userId: order.userId,
                    email: order.user.email,
                    status: order.status,
                    totalPrice: order.totalPrice,
                    address: order.address,
                    paymentMethod: order.paymentMethod,
                    phone: order.phone,
                    createdAt: order.createdAt,
                    cancellationReason: order.cancellationReason,
                    items: order.order_items.map(item => `${item.item.name} (x${item.quantity}) - ${item.price}`).join('; '),
                });
            });
    
            // Устанавливаем имя файла
            const fileName = `orders_${Date.now()}.xlsx`;
    
            // Отправляем файл в качестве ответа
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Ошибка при экспорте заказов в Excel:", error);
            return res.status(500).json({ message: 'Ошибка экспорта заказов в Excel' });
        }
    }
    
    
    //добавление или изменение причины отмены заказа
    async setOrUpdateCancellationReason(req, res) {
        try {
            const { orderId, cancellationReason } = req.body;
    
            // Проверяем роль пользователя
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Доступ запрещён' });
            }
    
            // Найти заказ по ID
            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }
    
            // Добавить или обновить причину отмены
            order.cancellationReason = cancellationReason;
            await order.save();
    
            return res.json({ 
                message: order.cancellationReason 
                    ? 'Причина отмены обновлена' 
                    : 'Причина отмены добавлена', 
                order 
            });
        } catch (error) {
            console.error("Ошибка при добавлении или обновлении причины отмены:", error);
            return res.status(500).json({ message: 'Ошибка добавления или обновления причины отмены' });
        }
    }
    
    

    //изменение статуса заказа
    async updateOrderStatus(req, res) {
        try {
            const { orderId, status } = req.body;

            // Проверяем роль пользователя
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Только администратор может изменять статус заказа' });
            }

            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            if (!['В обработке' ,'Принят', 'Передан курьеру', 'Выполнен', 'Возврат' , 'Отменен'].includes(status)) {
                return res.status(400).json({ message: 'Некорректный статус' });
            }

            order.status = status;
            await order.save();

            return res.status(200).json({ message: 'Статус заказа обновлен', order });
        } catch (error) {
            console.error("Ошибка при обновлении статуса заказа:", error);
            return res.status(500).json({ message: 'Ошибка обновления статуса заказа' });
        }
    }

     // Метод для удаления заказа
     async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            const isAdmin = req.user.role === 'ADMIN';

            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Проверка на право удаления: админ или владелец заказа
            if (!isAdmin && order.userId !== userId) {
                return res.status(403).json({ message: 'Доступ запрещен' });
            }

            await OrderItem.destroy({ where: { orderId } });
            await order.destroy();

            return res.status(200).json({ message: 'Заказ удален' });
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
            return res.status(500).json({ message: 'Ошибка удаления заказа' });
        }
    }
    
    async removeItemFromBasket(req, res) {
        try {
            const { itemId } = req.params; // Берем itemId из параметров маршрута
            const userId = req.user.id;
    
            if (!itemId) {
                return res.status(400).json({ message: 'ID товара обязателен' });
            }
    
            const userBasket = await Basket.findOne({ where: { userId } });
            if (!userBasket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }
    
            const basketItem = await BasketItem.findOne({
                where: { basketId: userBasket.id, itemId },
            });
    
            if (!basketItem) {
                return res.status(404).json({ message: 'Товар не найден в корзине' });
            }
    
            await basketItem.destroy();
    
            return res.status(200).json({ message: 'Товар удален из корзины' });
        } catch (error) {
            console.error("Ошибка при удалении товара из корзины:", error);
            return res.status(500).json({ message: 'Ошибка удаления товара из корзины' });
        }
    }

    async clearBasket(req, res) {
        try {
            const userId = req.user.id;
    
            const userBasket = await Basket.findOne({ where: { userId } });
            if (!userBasket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }
    
            await BasketItem.destroy({ where: { basketId: userBasket.id } });
    
            return res.status(200).json({ message: 'Все товары удалены из корзины' });
        } catch (error) {
            console.error("Ошибка при очистке корзины:", error);
            return res.status(500).json({ message: 'Ошибка очистки корзины' });
        }
    }
    
    

}

module.exports = new BasketController();
