import express from 'express';
import authController from '../Controllers/authController';
import redFlagsController from '../Controllers/redFlagsController';
import interventionsController from '../Controllers/interventionsController';
import auth from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Red-flag routes
router.get('/red-flags', auth.verifyToken, redFlagsController.getAllRedFlags);
router.get('/red-flags/:id', auth.verifyToken, redFlagsController.getRedFlag);
router.post('/red-flags', auth.verifyToken, redFlagsController.createRedFlag);
router.patch('/red-flags/:id/location', auth.verifyToken, auth.checkRecordOwnership('red_flags'), redFlagsController.updateLocation);
router.patch('/red-flags/:id/comment', auth.verifyToken, auth.checkRecordOwnership('red_flags'), redFlagsController.updateComment);
router.delete('/red-flags/:id', auth.verifyToken, auth.checkRecordOwnership('red_flags'), redFlagsController.deleteRedFlag);
router.patch('/red-flags/:id/status', auth.verifyToken, auth.isAdmin, redFlagsController.updateStatus);

// Intervention routes
router.get('/interventions', auth.verifyToken, interventionsController.getAllInterventions);
router.get('/interventions/:id', auth.verifyToken, interventionsController.getIntervention);
router.post('/interventions', auth.verifyToken, interventionsController.createIntervention);
router.patch('/interventions/:id/location', auth.verifyToken, auth.checkRecordOwnership('interventions'), interventionsController.updateLocation);
router.patch('/interventions/:id/comment', auth.verifyToken, auth.checkRecordOwnership('interventions'), interventionsController.updateComment);
router.delete('/interventions/:id', auth.verifyToken, auth.checkRecordOwnership('interventions'), interventionsController.deleteIntervention);
router.patch('/interventions/:id/status', auth.verifyToken, auth.isAdmin, interventionsController.updateStatus);

export default router;