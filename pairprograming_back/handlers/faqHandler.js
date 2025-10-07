const FAQ = require("../models/FAQ");

class FAQHandler {
  static async getAllFAQs(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = { isActive: true };

      // Aplicar filtros
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      if (filters.search) {
        whereClause.question = {
          [FAQ.sequelize.Op.iLike]: `%${filters.search}%`,
        };
      }

      const { count, rows: faqs } = await FAQ.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [
          ["category", "ASC"],
          ["order", "ASC"],
        ],
      });

      return {
        success: true,
        data: faqs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener FAQs: ${error.message}`);
    }
  }

  static async getFAQById(id) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error("FAQ no encontrado");
      }
      return { success: true, data: faq };
    } catch (error) {
      throw new Error(`Error al obtener FAQ: ${error.message}`);
    }
  }

  static async createFAQ(faqData) {
    try {
      const newFAQ = await FAQ.create(faqData);
      return {
        success: true,
        message: "FAQ creado exitosamente",
        data: newFAQ,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al crear FAQ: ${error.message}`);
    }
  }

  static async updateFAQ(id, faqData) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error("FAQ no encontrado");
      }

      await faq.update(faqData);
      return {
        success: true,
        message: "FAQ actualizado exitosamente",
        data: faq,
      };
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Error de validación: ${messages.join(", ")}`);
      }
      throw new Error(`Error al actualizar FAQ: ${error.message}`);
    }
  }

  static async deleteFAQ(id) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error("FAQ no encontrado");
      }

      await faq.update({ isActive: false });
      return {
        success: true,
        message: "FAQ desactivado exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al eliminar FAQ: ${error.message}`);
    }
  }

  static async getFAQCategories() {
    try {
      const categories = await FAQ.findAll({
        attributes: ["category"],
        group: ["category"],
        where: { isActive: true },
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

  static async addFAQFeedback(id, helpful) {
    try {
      const faq = await FAQ.findByPk(id);
      if (!faq) {
        throw new Error("FAQ no encontrado");
      }

      if (helpful) {
        await faq.increment("helpful");
      } else {
        await faq.increment("notHelpful");
      }

      // Actualizar contador de vistas
      await faq.increment("views");

      return {
        success: true,
        message: "Feedback agregado exitosamente",
        data: {
          helpful: faq.helpful + (helpful ? 1 : 0),
          notHelpful: faq.notHelpful + (helpful ? 0 : 1),
          views: faq.views + 1,
        },
      };
    } catch (error) {
      throw new Error(`Error al agregar feedback: ${error.message}`);
    }
  }
}

module.exports = FAQHandler;
