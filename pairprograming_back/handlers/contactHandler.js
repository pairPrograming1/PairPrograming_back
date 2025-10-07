const ContactMessage = require("../models/ContactMessage");

class ContactHandler {
  static async getAllMessages(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.priority) {
        whereClause.priority = filters.priority;
      }
      if (filters.search) {
        whereClause.name = {
          [ContactMessage.sequelize.Op.iLike]: `%${filters.search}%`,
        };
      }

      const { count, rows: messages } = await ContactMessage.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    }
  }

  static async getMessageById(id) {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) {
        throw new Error("Mensaje no encontrado");
      }
      return { success: true, data: message };
    } catch (error) {
      throw new Error(`Error al obtener mensaje: ${error.message}`);
    }
  }

  static async createMessage(messageData) {
    try {
      const newMessage = await ContactMessage.create(messageData);
      return {
        success: true,
        message: "Mensaje enviado exitosamente",
        data: newMessage,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
  }

  static async updateMessageStatus(id, status) {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) {
        throw new Error("Mensaje no encontrado");
      }

      await message.update({ status });
      return {
        success: true,
        message: "Estado del mensaje actualizado exitosamente",
        data: message,
      };
    } catch (error) {
      throw new Error(`Error al actualizar mensaje: ${error.message}`);
    }
  }

  static async getMessagesStats() {
    try {
      const total = await ContactMessage.count();
      const newMessages = await ContactMessage.count({
        where: { status: "new" },
      });
      const replied = await ContactMessage.count({
        where: { status: "replied" },
      });

      return {
        success: true,
        data: {
          total,
          new: newMessages,
          replied,
          pending: total - replied,
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = ContactHandler;
