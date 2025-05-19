const express = require('express');
const UserController = require('../controllers/user.js');
const authMiddleware = require('../middleware/auth.js');
const userController = new UserController();

const router = express.Router();

// Public routes
router.post('/api/users/login', userController.login.bind(userController));

// Protected routes
router.get('/api/users/:id', authMiddleware, userController.getUserById.bind(userController));
router.get('/api/users', authMiddleware, userController.getAllUsers.bind(userController));
router.post('/api/users', authMiddleware, userController.createUser.bind(userController));
router.put('/api/users/:id', authMiddleware, userController.updateUser.bind(userController));
router.delete('/api/users/:id', authMiddleware, userController.deleteUser.bind(userController));

module.exports = router;