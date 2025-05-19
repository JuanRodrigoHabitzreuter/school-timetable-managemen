const jwt = require('jsonwebtoken');
const config = require('../../config');
const UserService = require('../services/user');
const service = new UserService();

class UserController {
  /**
   * Handle user login
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async login(req, res) {
    const { email, senha: password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const user = await service.authenticate(email, password);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.nome,
          role: user.tipo_Usuario,
        },
        config.secret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.nome,
          email: user.email,
          phone: user.telefone,
          role: user.tipo_Usuario,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(401).json({ 
        message: error.message || "Invalid email or password"
      });
    }
  }

  /**
   * Get user by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      
      // Check if requested user matches authenticated user or is admin
      if (req.user && req.user.id !== parseInt(userId) && req.user.role !== 0) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const user = await service.getUserById(userId);
      
      res.status(200).json({
        role: user.tipo_Usuario,
        email: user.email,
        phone: user.telefone,
        name: user.nome,
        id: user.id
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      
      // Handle not found separately
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get all users
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getAllUsers(req, res) {
    try {
      // Check if user is admin
      if (req.user && req.user.role !== 0) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await service.getAllUsers();
      
      res.status(200).json({
        users: users,
      });
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Create new user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async createUser(req, res) {
    try {
      const userData = req.body.user || req.body.usuario;
      
      if (!userData) {
        return res.status(400).json({ message: "User data is required" });
      }
      
      const result = await service.createUser(userData);
      
      res.status(201).json({
        message: "User created successfully",
        user: result,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Handle validation errors
      if (error.message.includes("already in use")) {
        return res.status(409).json({ message: error.message });
      }
      
      if (error.message.includes("required")) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update existing user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = req.body.user || req.body.usuario;
      
      if (!userData) {
        return res.status(400).json({ message: "User data is required" });
      }
      
      // Check if user is updating themselves or is admin
      if (req.user && req.user.id !== parseInt(userId) && req.user.role !== 0) {
        return res.status(403).json({ message: "You can only update your own account" });
      }
      
      const result = await service.updateUser(userId, userData);
      
      res.status(200).json({
        message: "User updated successfully",
        user: result,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      
      // Handle specific errors
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message.includes("already in use")) {
        return res.status(409).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      
      // Only allow admins to delete users
      if (req.user && req.user.role !== 0) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      await service.deleteUser(userId);
      
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;