import express from 'express' 
import { 
    createDonor,
    getAllDonars,
    getDonar, 
} from './../controllers/donorController.js'

const router = express.Router()

router.get('/',getAllDonars)
router.get('/:id',getDonar)

router.post('/',createDonor)

export default router