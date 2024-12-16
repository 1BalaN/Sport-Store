const Router = require('express')
const router = new Router()

const itemController = require('../controllers/itemController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), itemController.create)
router.get('/', itemController.getAll)
router.get('/:id', itemController.getOne)
router.delete('/', checkRole('ADMIN'), itemController.removeOne)
router.put('/:id', itemController.update)
// router.get('/export-excel', itemController.exportToExcel)


module.exports = router