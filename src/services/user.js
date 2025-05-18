const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user');
const repository = new UserRepository();

class UserService {
  /**
   * Validate user object data
   * @param {Object} user - User data to validate
   * @throws {Error} If validation fails
   */
  validateUserData(user) {
    if (!user) {
      throw new Error("User data is required");
    }
    
    if (!user.email || !this._isValidEmail(user.email)) {
      throw new Error("Valid email address is required");
    }
    
    if (!user.senha || user.senha.length < 6) {
      throw new Error("Password is required (minimum 6 characters)");
    }
    
    if (!user.nome || user.nome.trim() === '') {
      throw new Error("User name is required");
    }
    
    return true;
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   * @private
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Authenticate user (login)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authenticated user
   */
  async authenticate(email, password) {
    const user = await repository.findByEmail(email);

    if (!user) {
      throw new Error("Email address not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Don't return password in response
    const { senha, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error("Valid user ID is required");
    }
    
    const user = await repository.findById(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return user;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async getUserByEmail(email) {
    if (!email || !this._isValidEmail(email)) {
      throw new Error("Valid email address is required");
    }
    
    const user = await repository.findByEmail(email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    
    // Don't return password
    const { senha, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  /**
   * Get all users
   * @param {Object} transaction - Sequelize transaction
   * @returns {Promise<Array<Object>>} List of users
   */
  async getAllUsers(transaction) {
    return await repository.findAll(transaction);
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @param {Object} transaction - Sequelize transaction
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData, transaction) {
    this.validateUserData(userData);
    
    // Check if email already exists
    const existingUser = await repository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email address is already in use");
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    userData.senha = await bcrypt.hash(userData.senha, salt);
    
    return await repository.create(userData, transaction);
  }

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @param {Object} transaction - Sequelize transaction
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, userData, transaction) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error("Valid user ID is required");
    }
    
    // Don't allow changing email to existing one
    if (userData.email) {
      const existingUser = await repository.findByEmail(userData.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new Error("Email address is already in use by another account");
      }
    }
    
    // Hash password if provided
    if (userData.senha) {
      const salt = await bcrypt.genSalt(10);
      userData.senha = await bcrypt.hash(userData.senha, salt);
    }
    
    return await repository.update(id, userData, transaction);
  }

  /**
   * Delete a user
   * @param {number} id - User ID
   * @param {Object} transaction - Sequelize transaction
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteUser(id, transaction) {
    if (!id || isNaN(parseInt(id))) {
      throw new Error("Valid user ID is required");
    }
    
    await repository.delete(id, transaction);
    return true;
  }
}

module.exports = UserService;