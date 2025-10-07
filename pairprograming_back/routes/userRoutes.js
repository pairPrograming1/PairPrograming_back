const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// GET /api/users - Obtener todos los usuarios (con paginación)
router.get("/", UserController.getUsers);

// GET /api/users/search - Buscar usuarios
router.get("/search", UserController.searchUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get("/:id", UserController.getUser);

// POST /api/users - Crear nuevo usuario
router.post("/", UserController.createUser);

// PUT /api/users/:id - Actualizar usuario
router.put("/:id", UserController.updateUser);

// DELETE /api/users/:id - Eliminar usuario
router.delete("/:id", UserController.deleteUser);

module.exports = router;
