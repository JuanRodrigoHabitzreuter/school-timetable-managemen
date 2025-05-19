const User = require('../models/user');
const bcrypt = require('bcrypt');

class UserRepository {
  /**
   * Find a user by their ID
   * @param {number} id - User ID
   * @param {Object} transaction - Sequelize transaction object
   * @returns {Promise<User>} User object
   */
  async findById(id, transaction) {
    return User.findOne({
      where: { id },
      transaction,
      attributes: { exclude: ['senha'] } // Don't return password in normal queries
    });
  }

  /**
   * Find a user by email (used for authentication)
   * @param {string} email - User's email
   * @returns {Promise<User>} User object including password for auth
   */
  async findByEmail(email) {
    try {
      return await User.findOne({ 
        where: { email }
      });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  /**
   * Get all users
   * @param {Object} transaction - Sequelize transaction object
   * @returns {Promise<Array<User>>} List of users
   */
  async findAll(transaction) {
    return User.findAll({ 
      transaction,
      attributes: { exclude: ['senha'] } // Security: don't return passwords in list
    });
  }

  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @param {Object} transaction - Sequelize transaction object
   * @returns {Promise<User>} Created user
   */
  async create(userData, transaction) {
    const result = await User.create(userData, { transaction });
    
    // Return user without password
    const { senha, ...userWithoutPassword } = result.toJSON();
    return userWithoutPassword;
  }

  /**
   * Update a user's information
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @param {Object} transaction - Sequelize transaction object
   * @returns {Promise<Object>} Update result
   */
  async update(id, userData, transaction) {
    const [updatedRows] = await User.update(
      userData,
      { 
        where: { id }, 
        transaction,
        returning: true
      }
    );
    
    if (updatedRows === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Fetch and return the updated user
    return this.findById(id, transaction);
  }

  /**
   * Delete a user
   * @param {number} id - User ID
   * @param {Object} transaction - Sequelize transaction object
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(id, transaction) {
    const deleted = await User.destroy({
      where: { id },
      transaction
    });
    
    if (deleted === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return deleted;
  }
}

module.exports = UserRepository;