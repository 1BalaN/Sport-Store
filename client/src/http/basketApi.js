import { $authHost } from "."; 

// Добавление товара в корзину
export const addToBasket = async (itemId, quantity = 1) => {
    try {
        const { data: item } = await $authHost.get(`/api/item/${itemId}`); // Получаем данные товара
        if (item.quantity >= quantity) {
            const response = await $authHost.post('/api/basket/add', { itemId, quantity });
            return response.data;
        } else {
            throw new Error(`Недостаточное количество товара на складе: доступно ${item.quantity}`);
        }
    } catch (error) {
        console.error("Ошибка в addToBasket:", error.response?.data || error.message);
        throw error;
    }
};

// Обновление количества товара в корзине с проверкой
export const updateCartItemQuantity = async (itemId, quantity) => {
    try {
        if (quantity > 0) {
            const response = await $authHost.put('/api/basket/update', { itemId, quantity });
            return response.data;
        } else {
            return await removeFromBasket(itemId); // Удаляем товар, если количество становится нулевым
        }
    } catch (error) {
        console.error("Ошибка в updateCartItemQuantity:", error.response?.data || error.message);
        throw error;
    }
};

// Удаление товара из корзины
export const removeFromBasket = async (itemId) => {
    try {
        const response = await $authHost.delete(`/api/basket/remove/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка в removeFromBasket:", error.response?.data || error.message);
        throw error;
    }
};

// Удаление всех товаров из корзины
export const clearBasket = async () => {
    try {
        const response = await $authHost.delete('/api/basket/clear');
        return response.data;
    } catch (error) {
        console.error("Ошибка в clearBasket:", error.response?.data || error.message);
        throw error;
    }
};


// Оформление заказа
export const checkout = async (address, paymentMethod, phone) => {
    try {
        
        const response = await $authHost.post('/api/basket/checkout', { address, paymentMethod, phone });
        return response.data; 
    } catch (error) {
        console.error("Ошибка в checkout:", error.response?.data || error.message);
        throw error; 
    }
};
