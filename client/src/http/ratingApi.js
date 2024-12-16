import { $authHost, $host } from ".";

// Получить средний рейтинг товара
export const fetchItemAverageRating = async (itemId) => {
    const { data } = await $host.get(`/api/raiting/average/${itemId}`);
    return data; // Ожидается, что вернется объект с полем averageRating
};

// Получить рейтинг пользователя для товара
export const fetchUserRating = async (itemId) => {
    const { data } = await $authHost.get(`/api/raiting/user-rating/${itemId}`);
    return data; // Ожидается, что вернется объект с полем rating
};

// Отправить или обновить рейтинг для товара
export const setRating = async (itemId, rate) => {
    const { data } = await $authHost.post('/api/raiting', { itemId, rate });
    return data; // Ответ от сервера
};
