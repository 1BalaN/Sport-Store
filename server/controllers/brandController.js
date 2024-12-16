const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) {
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }
    async getAll(req, res, next) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }
    async removeOne (req, res) {
        const {id} = req.query
        try {
          const response =  await Brand.destroy({where:{id}}).then((data) => {
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

module.exports = new BrandController()