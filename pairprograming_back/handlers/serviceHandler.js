const Service = require("../models/Service");

class ServiceHandler {
  static async getAllServices(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      if (filters.search) {
        whereClause.title = {
          [Service.sequelize.Op.iLike]: `%${filters.search}%`,
        };
      }

      const { count, rows: services } = await Service.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        data: services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener servicios: ${error.message}`);
    }
  }

  static async getServiceById(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Servicio no encontrado");
      }
      return { success: true, data: service };
    } catch (error) {
      throw new Error(`Error al obtener servicio: ${error.message}`);
    }
  }

  static async createService(serviceData) {
    try {
      const newService = await Service.create(serviceData);
      return {
        success: true,
        message: "Servicio creado exitosamente",
        data: newService,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear servicio: ${error.message}`);
    }
  }

  static async updateService(id, serviceData) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Servicio no encontrado");
      }

      await service.update(serviceData);
      return {
        success: true,
        message: "Servicio actualizado exitosamente",
        data: service,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al actualizar servicio: ${error.message}`);
    }
  }

  static async deleteService(id) {
    try {
      const service = await Service.findByPk(id);
      if (!service) {
        throw new Error("Servicio no encontrado");
      }

      await service.update({ isActive: false });
      return {
        success: true,
        message: "Servicio desactivado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar servicio: ${error.message}`);
    }
  }

  static async getServiceCategories() {
    try {
      const categories = await Service.findAll({
        attributes: ["category"],
        group: ["category"],
        raw: true,
      });

      const categoryList = categories.map((item) => item.category);
      return {
        success: true,
        data: categoryList,
      };
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }
}

module.exports = ServiceHandler;
