const ProjectHandler = require("../handlers/projectHandler");

class ProjectController {
  static async getProjects(req, res) {
    try {
      const { page = 1, limit = 10, category, featured, search } = req.query;
      const filters = { category, featured, search };

      const result = await ProjectHandler.getAllProjects(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getProject(req, res) {
    try {
      const { id } = req.params;
      const result = await ProjectHandler.getProjectById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
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

  static async createProject(req, res) {
    try {
      const projectData = req.body;

      if (!projectData.title || !projectData.description) {
        return res.status(400).json({
          success: false,
          error: "Título y descripción son requeridos",
        });
      }

      const result = await ProjectHandler.createProject(projectData);
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

  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const projectData = req.body;

      const result = await ProjectHandler.updateProject(id, projectData);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
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

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const result = await ProjectHandler.deleteProject(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Proyecto no encontrado") {
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

  static async getFeaturedProjects(req, res) {
    try {
      const result = await ProjectHandler.getFeaturedProjects();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ProjectController;
