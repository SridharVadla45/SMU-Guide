import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as paymentMethodController from '../controllers/payment-method.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', paymentMethodController.listPaymentMethods);
router.post('/', paymentMethodController.addPaymentMethod);

export default router;
