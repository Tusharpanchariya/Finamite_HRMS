import express from 'express';
import {
  createStatutoryDetails,
  getStatutoryDetailsByEmployeeId,
  deleteStatutoryDetails,
  updateStatutoryDetails,
  getAllStatutoryDetails
} from '../controllers/EmpDetails.controller';

const router = express.Router();

// Add or Update statutory details
router.post('/', createStatutoryDetails);

// Get statutory details by employeeId
router.get('/:employeeId', getStatutoryDetailsByEmployeeId);
router.get('/', getAllStatutoryDetails)

// update deatils 
router.put('/:employeeId', updateStatutoryDetails);
// Delete statutory details by employeeId
router.delete('/:employeeId', deleteStatutoryDetails);

export default router;
