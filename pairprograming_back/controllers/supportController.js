const SupportHandler = require("../handlers/supportHandler");

class SupportController {
  static async getTickets(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        category,
        search,
      } = req.query;
      const filters = { status, priority, category, search };

      const result = await SupportHandler.getAllTickets(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getTicket(req, res) {
    try {
      const { id } = req.params;
      const result = await SupportHandler.getTicketById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Ticket no encontrado") {
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

  static async createTicket(req, res) {
    try {
      const ticketData = req.body;

      if (
        !ticketData.subject ||
        !ticketData.description ||
        !ticketData.customerEmail ||
        !ticketData.customerName
      ) {
        return res.status(400).json({
          success: false,
          error: "Asunto, descripción, email y nombre son requeridos",
        });
      }

      const result = await SupportHandler.createTicket(ticketData);
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

  static async addMessage(req, res) {
    try {
      const { id } = req.params;
      const messageData = req.body;

      if (
        !messageData.message ||
        !messageData.sender ||
        !messageData.senderName
      ) {
        return res.status(400).json({
          success: false,
          error: "Mensaje, remitente y nombre son requeridos",
        });
      }

      const result = await SupportHandler.addMessage(id, messageData);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === "Ticket no encontrado") {
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

  static async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, resolution } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: "El estado es requerido",
        });
      }

      const result = await SupportHandler.updateTicketStatus(
        id,
        status,
        resolution
      );
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Ticket no encontrado") {
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

  static async getSupportStats(req, res) {
    try {
      const result = await SupportHandler.getSupportStats();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = SupportController;
