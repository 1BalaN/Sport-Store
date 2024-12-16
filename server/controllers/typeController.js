const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }
    async getAll(req, res, next) {
        const types = await Type.findAll()
        return res.json(types)
    }
    async removeOne (req, res) {
        const {id} = req.query
        try {
          const response =  await Type.destroy({where:{id}}).then((data) => {
            if(data) {
                console.log('объект успешно удален')
            } else {
                return
            }
          })
          console.log('удалено')
          return res.json(response)
            
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = new TypeController()