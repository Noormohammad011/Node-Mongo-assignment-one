import express from 'express'
import {
  getRandomUser,
  getAllUsers,
  saveUser,
  updateUser,
  deleteUser,
  bulkUpdateUser,
} from '../controllers/userController.js'



const router = express.Router()


router.route('/random').get(getRandomUser)
router.route('/all').get(getAllUsers)
router.route('/save').post(saveUser)
router.route('/bulk-update').patch(bulkUpdateUser)
router.route('/update/:id').put(updateUser)
router.route('/delete/:id').delete(deleteUser)



export default router