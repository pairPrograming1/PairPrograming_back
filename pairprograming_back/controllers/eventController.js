const EventHandler = require("../handlers/eventHandler");

class EventController {
  static async getEvents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        startDate,
        endDate,
      } = req.query;
      const filters = { type, status, startDate, endDate };

      const result = await EventHandler.getAllEvents(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventHandler.getEventById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Evento no encontrado") {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }

  static async createEvent(req, res) {
    try {
      const eventData = req.body;

      if (!eventData.title || !eventData.startDate || !eventData.endDate) {
        return res.status(400).json({
          success: false,
          error: "Título, fecha de inicio y fecha de fin son requeridos",
        });
      }

      const result = await EventHandler.createEvent(eventData);
      res.status(201).json(result);
    } catch (error) {
      if (error.message.includes("Error de validación")) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const eventData = req.body;

      const result = await EventHandler.updateEvent(id, eventData);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Evento no encontrado") {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else if (error.message.includes("Error de validación")) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventHandler.deleteEvent(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Evento no encontrado") {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }

  static async getUpcomingEvents(req, res) {
    try {
      const result = await EventHandler.getUpcomingEvents();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = EventController;
