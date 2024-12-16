import { $authHost } from "."; 

// Получение истории заказов пользователя
export const getOrderHistory = async () => {
    try {
        const { data } = await $authHost.get('/api/basket/history'); 
        return data.map(order => ({
            id: order.id,
            status: order.status,
            totalPrice: order.totalPrice,
            address: order.address,
            paymentMethod: order.paymentMethod,
            phone: order.phone,
            createdAt: order.createdAt, 
            cancellationReason: order.cancellationReason || null, 
            items: order.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        }));
    } catch (error) {
        console.error("Ошибка в getOrderHistory:", error.response?.data || error.message);
        throw error; 
    }
};

// Получение всех заказов (для администратора)
export const getAllOrders = async () => {
    try {
        const { data } = await $authHost.get('/api/basket/admin/all'); 
        console.log("Полученные заказы:", data); // Лог для проверки
        return data.map(order => ({
            id: order.id,
            userId: order.userId,
            email: order.email,
            status: order.status,
            totalPrice: order.totalPrice,
            address: order.address,
            paymentMethod: order.paymentMethod,
            phone: order.phone,
            createdAt: order.createdAt, 
            cancellationReason: order.cancellationReason || null, 
            items: order.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        }));
    } catch (error) {
        console.error("Ошибка в getAllOrders:", error.response?.data || error.message);
        throw error; 
    }
};

// Экспорт заказов в Excel (для администратора)
export const exportOrdersToExcel = async () => {
    try {
        const response = await $authHost.get('/api/basket/admin/excel', { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_${Date.now()}.xlsx`;
        link.click();
    } catch (error) {
        console.error("Ошибка в exportOrdersToExcel:", error.response?.data || error.message);
        throw error;
    }
};


//добавление или измение причины отмены заказа
export const setCancellationReason = async (orderId, cancellationReason) => {
    try {
        const { data } = await $authHost.post('/api/basket/set-cancellation-reason', { orderId, cancellationReason });
        return data;
    } catch (error) {
        console.error("Ошибка в setCancellationReason:", error.response?.data || error.message);
        throw error;
    }
};


// Обновление статуса заказа (только для администратора)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const { data } = await $authHost.put('/api/basket/update-status', { orderId, status });
        return data;
    } catch (error) {
        console.error("Ошибка в updateOrderStatus:", error.response?.data || error.message);
        throw error;
    }
};

// Удаление заказа
export const deleteOrder = async (orderId) => {
    try {
        const { data } = await $authHost.delete(`/api/basket/delete/${orderId}`);
        return data;
    } catch (error) {
        console.error("Ошибка в deleteOrder:", error.response?.data || error.message);
        throw error;
    }
};

