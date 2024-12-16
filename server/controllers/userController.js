const ApiError = require('../error/ApiError')
const {User, Basket, BasketItem, Order, OrderItem, Rating} = require('../models/models')
const sequelize = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECURE_KEY,
        {expiresIn: '24h'}
        )
}
class UserController {
    //регистрация
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if(!email || !password) {
            return next(ApiError.badRequest('Неверный email или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user  = await User.create({email, role, password:hashPassword})
        const basket = await Basket.create({userId:user.id})
        const token = generateJWT(user.id, user.email, user.role)
        return res.json({token})
    }
    //авторизация
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where:{email}})
 
        if(!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
 
        let comparePassword = bcrypt.compareSync(password, user.password)
 
        if(!comparePassword) {
            return next(ApiError.badRequest('Введен неверный пароль'))
        }
 
        const token = generateJWT(user.id, user.email, user.role)
        return res.json({token})
    }
    //аунтетификация
    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
         
    }
    //все пользователи
    async getAll(req, res, next) {
        let {email, id, first_name, last_name, phone} = req.query
        let users;
        if(!email && !first_name && !phone) {
            users = await User.findAndCountAll()
        }
        if(email && first_name && phone) {
            users = await User.findAndCountAll({where:{email, first_name, phone}})
        }        
        return res.json(users)
    }

    async deleteUser(req, res, next) {
        const { id } = req.params; // Получение ID из параметров запроса
        const transaction = await sequelize.transaction(); // Начало транзакции
        try {
            // Проверка роли администратора
            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Доступ запрещен'));
            }
    
            // Получение пользователя
            const user = await User.findOne({ where: { id }, transaction });
    
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            // Запрещаем удаление администраторов
            if (user.role === 'ADMIN') {
                return next(ApiError.forbidden('Нельзя удалить администратора'));
            }
    
            // Удаление рейтингов пользователя
            await Rating.destroy({ where: { userId: id }, transaction });
    
            // Получение корзины пользователя
            const basket = await Basket.findOne({ where: { userId: id }, transaction });
    
            if (basket) {
                // Удаление содержимого корзины
                await BasketItem.destroy({ where: { basketId: basket.id }, transaction });
                // Удаление корзины
                await Basket.destroy({ where: { id: basket.id }, transaction });
            }
    
            // Получение заказов пользователя
            const orders = await Order.findAll({ where: { userId: id }, transaction });
    
            if (orders.length > 0) {
                // Удаление элементов заказов
                await OrderItem.destroy({
                    where: { orderId: orders.map(order => order.id) },
                    transaction
                });
    
                // Удаление заказов
                await Order.destroy({ where: { userId: id }, transaction });
            }
    
            // Удаление пользователя
            await user.destroy({ transaction });
    
            await transaction.commit(); // Подтверждение транзакции
            return res.json({ message: `Пользователь с id ${id} и связанные данные успешно удалены` });
        } catch (e) {
            await transaction.rollback(); // Откат транзакции в случае ошибки
            return next(ApiError.internal(e.message));
        }
    }
    

    async updatePhone(req, res, next) {
        const { id } = req.params;
        const { phone } = req.body;
    
        if (!phone) {
            return next(ApiError.badRequest('Телефон не может быть пустым'));
        }
    
        try {
            const existingUser = await User.findOne({ where: { phone } });
            if (existingUser && existingUser.id !== parseInt(id)) {
                return next(ApiError.badRequest('Этот номер телефона уже используется другим пользователем'));
            }
    
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            user.phone = phone;
            await user.save();
    
            return res.json({ message: 'Телефон успешно обновлен', user });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
    
    async checkPhone(req, res, next) {
        const { phone } = req.query;
        
        if (!phone) {
            return next(ApiError.badRequest('Телефон не может быть пустым'));
        }
        
        const existingUser = await User.findOne({ where: { phone } });
        
        if (existingUser) {
            return res.json({ unique: false });
        }
    
        return res.json({ unique: true });
    }

    async getUserInfo(req, res, next) {
        const { id } = req.params; // Получаем ID из параметров запроса
    
        try {
            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'phone'], // Указываем, какие поля извлечь
            });
    
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            return res.json(user);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
    
    
}
 
module.exports = new UserController()