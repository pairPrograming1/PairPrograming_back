const SupportTicket = require("../models/SupportTicket");
const SupportMessage = require("../models/SupportMessage");

class SupportHandler {
  static async getAllTickets(page = 1, limit = 10, filters = {}) {
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
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.search) {
        whereClause.subject = {
          [SupportTicket.sequelize.Op.iLike]: `%${filters.search}%`,
        };
      }

      const { count, rows: tickets } = await SupportTicket.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: SupportMessage,
            as: "messages",
            required: false,
            limit: 1,
            order: [["created_at", "DESC"]],
          },
        ],
      });

      return {
        success: true,
        data: tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  static async getTicketById(id) {
    try {
      const ticket = await SupportTicket.findByPk(id, {
        include: [
          {
            model: SupportMessage,
            as: "messages",
            order: [["created_at", "ASC"]],
          },
        ],
      });
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }
      return { success: true, data: ticket };
    } catch (error) {
      throw new Error(`Error al obtener ticket: ${error.message}`);
    }
  }

  static async createTicket(ticketData) {
    try {
      // Generar número de ticket único
      const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
      ticketData.ticketNumber = ticketNumber;

      const newTicket = await SupportTicket.create(ticketData);

      // Crear mensaje inicial si se proporciona
      if (ticketData.initialMessage) {
        await SupportMessage.create({
          ticketId: newTicket.id,
          message: ticketData.initialMessage,
          sender: "customer",
          senderName: ticketData.customerName,
        });
      }

      return {
        success: true,
        message: "Ticket creado exitosamente",
        data: newTicket,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  static async addMessage(ticketId, messageData) {
    try {
      const ticket = await SupportTicket.findByPk(ticketId);
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }

      const newMessage = await SupportMessage.create({
        ticketId,
        ...messageData,
      });

      // Actualizar estado del ticket si es necesario
      if (messageData.sender === "agent") {
        await ticket.update({ status: "in-progress" });
      }

      return {
        success: true,
        message: "Mensaje agregado exitosamente",
        data: newMessage,
      };
    } catch (error) {
      throw new Error(`Error al agregar mensaje: ${error.message}`);
    }
  }

  static async updateTicketStatus(id, status, resolution = null) {
    try {
      const ticket = await SupportTicket.findByPk(id);
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }

      const updateData = { status };
      if (status === "resolved" && resolution) {
        updateData.resolution = resolution;
        updateData.resolvedAt = new Date();
      }

      await ticket.update(updateData);
      return {
        success: true,
        message: "Estado del ticket actualizado exitosamente",
        data: ticket,
      };
    } catch (error) {
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  }

  static async getSupportStats() {
    try {
      const total = await SupportTicket.count();
      const open = await SupportTicket.count({ where: { status: "open" } });
      const inProgress = await SupportTicket.count({
        where: { status: "in-progress" },
      });
      const resolved = await SupportTicket.count({
        where: { status: "resolved" },
      });

      return {
        success: true,
        data: {
          total,
          open,
          inProgress,
          resolved,
          resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = SupportHandler;
