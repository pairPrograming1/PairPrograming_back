const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/projectController");

// GET /api/projects - Obtener todos los proyectos
router.get("/", ProjectController.getProjects);

// GET /api/projects/featured - Obtener proyectos destacados
router.get("/featured", ProjectController.getFeaturedProjects);

// GET /api/projects/:id - Obtener proyecto por ID
router.get("/:id", ProjectController.getProject);

// POST /api/projects - Crear nuevo proyecto
router.post("/", ProjectController.createProject);

// PUT /api/projects/:id - Actualizar proyecto
router.put("/:id", ProjectController.updateProject);

// DELETE /api/projects/:id - Eliminar proyecto
router.delete("/:id", ProjectController.deleteProject);

module.exports = router;
