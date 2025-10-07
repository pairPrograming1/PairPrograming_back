const ContactHandler = require("../handlers/contactHandler");

class ContactController {
  static async getMessages(req, res) {
    try {
      const { page = 1, limit = 10, status, priority, search } = req.query;
      const filters = { status, priority, search };

      const result = await ContactHandler.getAllMessages(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getMessage(req, res) {
    try {
      const { id } = req.params;
      const result = await ContactHandler.getMessageById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Mensaje no encontrado") {
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

  static async createMessage(req, res) {
    try {
      const messageData = req.body;

      if (!messageData.name || !messageData.email || !messageData.message) {
        return res.status(400).json({
          success: false,
          error: "Nombre, email y mensaje son requeridos",
        });
      }

      const result = await ContactHandler.createMessage(messageData);
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

  static async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: "El estado es requerido",
        });
      }

      const result = await ContactHandler.updateMessageStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Mensaje no encontrado") {
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

  static async getMessagesStats(req, res) {
    try {
      const result = await ContactHandler.getMessagesStats();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ContactController;
