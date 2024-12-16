const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/', userController.getAll)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), userController.deleteUser);
router.put('/:id/phone', authMiddleware, userController.updatePhone);
router.get('/check-phone', userController.checkPhone); 
router.get('/user-info/:id', authMiddleware, userController.getUserInfo);



module.exports = router