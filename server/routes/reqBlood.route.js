import express from 'express'
import {
    acceptReq,
    confirmReq,
    createRecipients, 
    getAllRequests, 
    getRequest, 
    rejectReq, 
    sendRequest
} from './../controllers/reqBloodController.js' 

const router = express.Router() 

router.get('/',getAllRequests)
router.get('/:id',getRequest)
router.put('/:id',acceptReq)
router.put('/reject/:id',rejectReq)

router.post('/',createRecipients)
router.post('/:id',sendRequest)
router.put('/confirm/:id',confirmReq)

export default router