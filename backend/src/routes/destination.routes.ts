import { Router } from 'express';
import * as destinationController from '../controllers/destination.controller';

const router = Router();

// Get all destinations
router.get('/', destinationController.getDestinations);

// Get destination by ID
router.get('/:destinationId', destinationController.getDestinationById);

// Search destinations
router.get('/search', destinationController.searchDestinations);

export default router;
