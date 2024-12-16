require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000;

const app = express()

app.use(cors())  //{allowedHeaders: ['Content-Type', 'Authorization']}
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()  // Подключение к базе данных
        console.log("База данных подключена!")

        // Синхронизация базы данных, включая добавление недостающих столбцов
        await sequelize.sync({ alter: true })
        console.log("Синхронизация базы данных завершена!")

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log("Ошибка подключения или синхронизации базы данных:", e)
    }
}

start()
