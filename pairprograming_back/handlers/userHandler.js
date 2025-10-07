const User = require("../models/User");

class UserHandler {
  static async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      if (filters.role) {
        whereClause.role = filters.role;
      }
      if (filters.search) {
        whereClause.name = { [User.sequelize.Op.iLike]: `%${filters.search}%` };
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
        attributes: { exclude: ["profileData"] }, // Excluir datos sensibles
      });

      return {
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return { success: true, data: user };
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  static async createUser(userData) {
    try {
      userData.email = userData.email.toLowerCase();

      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      const newUser = await User.create(userData);
      return {
        success: true,
        message: "Usuario creado exitosamente",
        data: newUser,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  static async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (userData.email) {
        userData.email = userData.email.toLowerCase();
        const existingUser = await User.findOne({
          where: {
            email: userData.email,
            id: { [User.sequelize.Op.ne]: id },
          },
        });

        if (existingUser) {
          throw new Error("El email ya está registrado");
        }
      }

      await user.update(userData);
      return {
        success: true,
        message: "Usuario actualizado exitosamente",
        data: user,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      await user.update({ isActive: false });
      return {
        success: true,
        message: "Usuario desactivado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

module.exports = UserHandler;
