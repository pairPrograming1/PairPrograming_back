const User = require("../models/User");

class UserHandler {
  // Obtener todos los usuarios con paginación
  static async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
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

  // Obtener usuario por ID
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

  // Crear nuevo usuario
  static async createUser(userData) {
    try {
      // Normalizar email a minúsculas
      userData.email = userData.email.toLowerCase();

      const existingUser = await User.findByEmail(userData.email);

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

  // Actualizar usuario
  static async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Normalizar email si se está actualizando
      if (userData.email) {
        userData.email = userData.email.toLowerCase();

        // Verificar si el email ya existe en otro usuario
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

  // Eliminar usuario (soft delete)
  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Opción 1: Eliminación suave (recomendado)
      await user.update({ isActive: false });

      // Opción 2: Eliminación permanente (descomentar si lo necesitas)
      // await user.destroy();

      return {
        success: true,
        message: "Usuario desactivado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Buscar usuarios por nombre
  static async searchUsers(searchTerm, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { Op } = require("sequelize");

      const { count, rows: users } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } },
            { email: { [Op.iLike]: `%${searchTerm}%` } },
          ],
        },
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
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
      throw new Error(`Error al buscar usuarios: ${error.message}`);
    }
  }
}

module.exports = UserHandler;
