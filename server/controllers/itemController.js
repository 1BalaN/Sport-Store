const uuid = require('uuid')
const path = require('path')
const ExcelJS = require('exceljs');
const {Item, ItemInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

const { Op } = require('sequelize');


class ItemController {

    // Метод создания товара
    async create(req, res, next) {
        console.log(req.body, 'body в создании');
        try {
            let { name, price, brandId, typeId, info, quantity } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            
            // Создаем товар с количеством и значением "в наличии" по умолчанию
            const item = await Item.create({
                name, 
                price, 
                brandId, 
                typeId, 
                info, 
                img: fileName, 
                quantity,
                availability: 'в наличии' // Устанавливаем availability по умолчанию
            });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => 
                    ItemInfo.create({
                        title: i.title,
                        description: i.description,
                        itemId: item.id
                    })
                );
            }

            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Метод изменения товара
    async update(req, res, next) {
        console.log("Переданные данные для обновления:", req.body);
        let { id } = req.params;
        const { name, price, quantity, availability } = req.body;  // Получаем availability для изменения
        try {
            const item = await Item.findByPk(id);
            if (item) {
                item.name = name;
                item.price = price;
                item.quantity = quantity;  // Обновляем количество
                if (availability) {
                    item.availability = availability; // Обновляем availability (можно изменить на 'в наличии' или 'нет в наличии')
                }
                await item.save();
                res.send('Данные успешно изменены');
            } else {
                res.status(404).send('Товар не найден');
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res, next) {
        let { brandId, typeId, limit, page, searchQuery } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
    
        try {
            const filters = {};
    
            // Фильтрация по бренду и категории, если они заданы
            if (brandId) {
                filters.brandId = brandId;
            }
            if (typeId) {
                filters.typeId = typeId;
            }
    
            // Фильтрация по поисковому запросу
            if (searchQuery) {
                filters.name = { [Op.iLike]: `%${searchQuery}%` };
            }
    
            // Выполнение запроса с учетом всех фильтров
            const items = await Item.findAndCountAll({
                where: filters,
                limit,
                offset,
                order: [['rating', 'DESC']],
            });
    
            return res.json(items);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    
    async getOne(req, res) {
        const {id} = req.params
      const item = await Item.findOne(
            {
            where:{id},
            include:[{model: ItemInfo, as: 'info'}]
        },
        )
        return res.json(item)
    }

    async removeOne (req, res) {
        const {id} = req.query
        try {
          const response =  await Item.destroy({where:{id}}).then((data) => {
            if(data) {
                console.log('объект успешно удален')
            } else {
                return
            }
          })
          console.log(response)
          return res.json(response)
            
        } catch (e) {
            console.error(e)
        }
    }

    async updateItemQuantity(req, res)  {
        const { id, quantity } = req.body;
    
        if (!id || quantity === undefined) {
            return res.status(400).json({ message: "Не указаны id товара или количество" });
        }
    
        try {
            // Найдем товар по id
            const item = await Item.findOne({ where: { id } });
    
            if (!item) {
                return res.status(404).json({ message: "Товар не найден" });
            }
    
            // Обновим количество товара
            item.quantity = quantity;
    
            // Сохраним изменения
            await item.save();
    
            return res.json({ message: "Количество товара успешно обновлено" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка при обновлении количества товара" });
        }
    };

    
    
}

module.exports = new ItemController()