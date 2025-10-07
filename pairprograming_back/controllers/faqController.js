const FAQHandler = require("../handlers/faqHandler");

class FAQController {
  static async getFAQs(req, res) {
    try {
      const { page = 1, limit = 10, category, isActive, search } = req.query;
      const filters = { category, isActive, search };

      const result = await FAQHandler.getAllFAQs(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getFAQ(req, res) {
    try {
      const { id } = req.params;
      const result = await FAQHandler.getFAQById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "FAQ no encontrado") {
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

  static async createFAQ(req, res) {
    try {
      const faqData = req.body;

      if (!faqData.question || !faqData.answer || !faqData.category) {
        return res.status(400).json({
          success: false,
          error: "Pregunta, respuesta y categoría son requeridos",
        });
      }

      const result = await FAQHandler.createFAQ(faqData);
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

  static async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const faqData = req.body;

      const result = await FAQHandler.updateFAQ(id, faqData);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "FAQ no encontrado") {
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

  static async deleteFAQ(req, res) {
    try {
      const { id } = req.params;
      const result = await FAQHandler.deleteFAQ(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "FAQ no encontrado") {
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

  static async getFAQCategories(req, res) {
    try {
      const result = await FAQHandler.getFAQCategories();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async addFAQFeedback(req, res) {
    try {
      const { id } = req.params;
      const { helpful } = req.body;

      if (helpful === undefined) {
        return res.status(400).json({
          success: false,
          error: "El campo 'helpful' es requerido (true/false)",
        });
      }

      const result = await FAQHandler.addFAQFeedback(id, helpful);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "FAQ no encontrado") {
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
}

module.exports = FAQController;
