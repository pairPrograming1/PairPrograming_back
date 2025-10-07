const Event = require("../models/Event");

class EventHandler {
  static async getAllEvents(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (filters.type) {
        whereClause.type = filters.type;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.startDate) {
        whereClause.startDate = {
          [Event.sequelize.Op.gte]: new Date(filters.startDate),
        };
      }
      if (filters.endDate) {
        whereClause.endDate = {
          [Event.sequelize.Op.lte]: new Date(filters.endDate),
        };
      }

      const { count, rows: events } = await Event.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["startDate", "ASC"]],
      });

      return {
        success: true,
        data: events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos: ${error.message}`);
    }
  }

  static async getEventById(id) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new Error("Evento no encontrado");
      }
      return { success: true, data: event };
    } catch (error) {
      throw new Error(`Error al obtener evento: ${error.message}`);
    }
  }

  static async createEvent(eventData) {
    try {
      const newEvent = await Event.create(eventData);
      return {
        success: true,
        message: "Evento creado exitosamente",
        data: newEvent,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear evento: ${error.message}`);
    }
  }

  static async updateEvent(id, eventData) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      await event.update(eventData);
      return {
        success: true,
        message: "Evento actualizado exitosamente",
        data: event,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al actualizar evento: ${error.message}`);
    }
  }

  static async deleteEvent(id) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      await event.destroy();
      return {
        success: true,
        message: "Evento eliminado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar evento: ${error.message}`);
    }
  }

  static async getUpcomingEvents() {
    try {
      const now = new Date();
      const events = await Event.findAll({
        where: {
          startDate: {
            [Event.sequelize.Op.gte]: now,
          },
          status: "scheduled",
        },
        limit: 10,
        order: [["startDate", "ASC"]],
      });

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos próximos: ${error.message}`);
    }
  }
}

module.exports = EventHandler;
