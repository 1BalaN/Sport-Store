const { Rating, Item, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class RatingController {

    async addRating(req, res, next) {
        const { itemId, rate } = req.body;
        const userId = req.user.id;
    
        // Проверка: рейтинг должен быть в пределах 0–5
        if (rate < 0 || rate > 5) {
            return next(ApiError.badRequest('Оценка должна быть в пределах от 0 до 5'));
        }
    
        try {
            const item = await Item.findByPk(itemId);
    
            // Проверяем, существует ли товар
            if (!item) {
                return next(ApiError.badRequest('Товар не найден'));
            }
    
            // Проверяем, поставил ли пользователь уже оценку
            const existingRating = await Rating.findOne({ where: { itemId, userId } });
    
            if (existingRating) {
                return res.status(400).json({
                    message: 'Вы уже оценили этот товар',
                });
            }
    
            // Создаём новую оценку
            await Rating.create({ userId, itemId, rate });
    
            // Пересчитываем средний рейтинг товара
            const ratings = await Rating.findAll({ where: { itemId } });
            const averageRating = ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length;
    
            // Обновляем средний рейтинг товара
            item.rating = averageRating;
            await item.save();
    
            return res.json({
                message: 'Оценка успешно добавлена',
                averageRating,
            });
        } catch (e) {
            next(ApiError.internal('Ошибка при добавлении оценки'));
        }
    }
    
    

    async getAverageRating(req, res, next) {
        const { id } = req.params;
        try {
            const item = await Item.findByPk(id);
            if (!item) {
                return next(ApiError.badRequest('Товар не найден'));
            }
            return res.json({ averageRating: item.rating });
        } catch (e) {
            next(ApiError.internal('Ошибка при получении среднего рейтинга'));
        }
    }
    

    // Метод для получения оценки пользователя для конкретного товара
    async getUserRating(req, res, next) {
        const { itemId } = req.params;
        const userId = req.user.id; // Получаем ID пользователя из авторизации

        try {
            const rating = await Rating.findOne({
                where: { itemId, userId },
            });

            if (!rating) {
                return res.json({ rating: null }); // Если пользователь не оценил товар
            }

            return res.json({ rating: rating.rate });
        } catch (e) {
            next(ApiError.internal('Ошибка при получении вашей оценки'));
        }
    }
}

module.exports = new RatingController();
