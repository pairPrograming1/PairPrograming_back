const UserHandler = require("../handlers/userHandler");

class UserController {
  // GET /api/users
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await UserHandler.getAllUsers(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/users/search?q=term
  static async searchUsers(req, res) {
    try {
      const { q: searchTerm, page = 1, limit = 10 } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          error: "Término de búsqueda requerido",
        });
      }

      const result = await UserHandler.searchUsers(searchTerm, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/users/:id
  static async getUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserHandler.getUserById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
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

  // POST /api/users
  static async createUser(req, res) {
    try {
      const userData = req.body;

      // Validación básica
      if (!userData.name || !userData.email) {
        return res.status(400).json({
          success: false,
          error: "Nombre y email son requeridos",
        });
      }

      const result = await UserHandler.createUser(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error.message.includes("El email ya está registrado")) {
        res.status(409).json({
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

  // PUT /api/users/:id
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      const result = await UserHandler.updateUser(id, userData);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else if (error.message.includes("El email ya está registrado")) {
        res.status(409).json({
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

  // DELETE /api/users/:id
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserHandler.deleteUser(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
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

module.exports = UserController;
