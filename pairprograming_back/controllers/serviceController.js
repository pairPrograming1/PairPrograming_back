const ServiceHandler = require("../handlers/serviceHandler");

class ServiceController {
  static async getServices(req, res) {
    try {
      const { page = 1, limit = 10, category, isActive, search } = req.query;
      const filters = { category, isActive, search };

      const result = await ServiceHandler.getAllServices(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceHandler.getServiceById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Servicio no encontrado") {
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

  static async createService(req, res) {
    try {
      const serviceData = req.body;

      if (
        !serviceData.title ||
        !serviceData.description ||
        !serviceData.category
      ) {
        return res.status(400).json({
          success: false,
          error: "Título, descripción y categoría son requeridos",
        });
      }

      const result = await ServiceHandler.createService(serviceData);
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

  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const serviceData = req.body;

      const result = await ServiceHandler.updateService(id, serviceData);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Servicio no encontrado") {
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

  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceHandler.deleteService(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Servicio no encontrado") {
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

  static async getServiceCategories(req, res) {
    try {
      const result = await ServiceHandler.getServiceCategories();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ServiceController;
