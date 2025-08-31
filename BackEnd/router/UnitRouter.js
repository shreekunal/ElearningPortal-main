const { Router } = require('express');
const Controller = require('../controller/Unit');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

// Create a new unit (instructors and admins only)
router.post('/createUnit/:courseId', verifyToken(['Instructor', 'Admin']), Controller.createUnit);

// Get all units for a specific course
router.get('/getCourseUnits/:courseId', verifyToken(), Controller.getCourseUnits);

// Get a specific unit by ID
router.get('/getUnit/:unitId', verifyToken(), Controller.getUnit);

// Update a unit (instructors and admins only)
router.put('/updateUnit/:unitId', verifyToken(['Instructor', 'Admin']), Controller.updateUnit);

// Delete a unit (instructors and admins only)
router.delete('/deleteUnit/:unitId', verifyToken(['Instructor', 'Admin']), Controller.deleteUnit);

// Get all units for courses the user is enrolled in
router.post('/getUserUnits', verifyToken(), Controller.getUnitsForUser);

module.exports = router;
