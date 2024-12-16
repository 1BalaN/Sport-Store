const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique:true},
    password: {type:DataTypes.STRING},
    role: {type:DataTypes.STRING, defaultValue: 'USER'},
    phone: {type:DataTypes.STRING, allowNull: true, unique: true},
}, {
    timestamps: false 
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {
    timestamps: false 
})

const BasketItem = sequelize.define('basket_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}, // Новое поле для количества
},{
    timestamps: false 
});


const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique: true, allowNull:false},
    price:{type:DataTypes.INTEGER, allowNull:false},
    rating:{type:DataTypes.FLOAT, defaultValue: 0},
    img:{type:DataTypes.STRING, allowNull:false},
    quantity:{type:DataTypes.INTEGER, defaultValue: 1},
    availability: { // новое поле для наличия
        type: DataTypes.ENUM('в наличии', 'нет в наличии'),
        defaultValue: 'в наличии',
        allowNull: false
    },
},{
    timestamps: false 
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique:true, allowNull:false},
},{
    timestamps: false 
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique:true, allowNull:false},
},{
    timestamps: false 
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate:{type:DataTypes.FLOAT, allowNull:false, validate: { min: 0, max: 5 }},
}, {
    timestamps: false 
})

const ItemInfo = sequelize.define('item_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type:DataTypes.STRING, allowNull:false},
    description:{type:DataTypes.STRING, allowNull:false},
}, {
    timestamps: false 
})

// const TypeBrand = sequelize.define('type_brand', {
//     id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
// }, {
//     timestamps: false 
// })

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, defaultValue: 'В обработке' },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не указан' },
    paymentMethod: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не выбран' },
    phone: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Время создания заказа
    cancellationReason: { type: DataTypes.STRING, allowNull: true }, // Причина отмены заказа
}, {
    timestamps: false 
});


const OrderItem = sequelize.define('order_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false }, // Добавить, если используется
}, {
    timestamps: false 
});


User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketItem)
BasketItem.belongsTo(Basket)

Type.hasMany(Item)
Item.belongsTo(Type)

Brand.hasMany(Item)
Item.belongsTo(Brand)

Item.hasMany(Rating)
Rating.belongsTo(Item)

Item.hasMany(BasketItem)
BasketItem.belongsTo(Item)

Item.hasMany(ItemInfo, {as: 'info'})
ItemInfo.belongsTo(Item)

// Type.belongsToMany(Brand, {through: TypeBrand})
// Brand.belongsToMany(Type, {through: TypeBrand})

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(BasketItem);
BasketItem.belongsTo(Order);

Order.hasMany(OrderItem, {onDelete: 'CASCADE'});      // Один заказ может содержать много OrderItems
OrderItem.belongsTo(Order);    // Каждый OrderItem связан с одним заказом

Item.hasMany(OrderItem);      // Один товар может быть в нескольких OrderItems
OrderItem.belongsTo(Item);    // Каждый OrderItem связан с одним товаром

module.exports = {
    User,
    Basket,
    BasketItem,
    Item,
    Type,
    Brand,
    Rating,
    ItemInfo,
    // TypeBrand,
    Order,
    OrderItem
}