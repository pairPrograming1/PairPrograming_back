const Project = require("../models/Project");

class ProjectHandler {
  static async getAllProjects(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = { status: "active" };

      // Aplicar filtros
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.featured !== undefined) {
        whereClause.featured = filters.featured;
      }
      if (filters.search) {
        whereClause.title = {
          [Project.sequelize.Op.iLike]: `%${filters.search}%`,
        };
      }

      const { count, rows: projects } = await Project.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        data: projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener proyectos: ${error.message}`);
    }
  }

  static async getProjectById(id) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }
      return { success: true, data: project };
    } catch (error) {
      throw new Error(`Error al obtener proyecto: ${error.message}`);
    }
  }

  static async createProject(projectData) {
    try {
      const newProject = await Project.create(projectData);
      return {
        success: true,
        message: "Proyecto creado exitosamente",
        data: newProject,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear proyecto: ${error.message}`);
    }
  }

  static async updateProject(id, projectData) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }

      await project.update(projectData);
      return {
        success: true,
        message: "Proyecto actualizado exitosamente",
        data: project,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al actualizar proyecto: ${error.message}`);
    }
  }

  static async deleteProject(id) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }

      await project.update({ status: "archived" });
      return {
        success: true,
        message: "Proyecto archivado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar proyecto: ${error.message}`);
    }
  }

  static async getFeaturedProjects() {
    try {
      const projects = await Project.findAll({
        where: {
          featured: true,
          status: "active",
        },
        limit: 6,
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      throw new Error(
        `Error al obtener proyectos destacados: ${error.message}`
      );
    }
  }
}

module.exports = ProjectHandler;
