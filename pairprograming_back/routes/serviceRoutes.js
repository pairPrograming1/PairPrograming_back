const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");

// GET /api/services - Obtener todos los servicios
router.get("/", ServiceController.getServices);

// GET /api/services/categories - Obtener categorías de servicios
router.get("/categories", ServiceController.getServiceCategories);

// GET /api/services/:id - Obtener servicio por ID
router.get("/:id", ServiceController.getService);

// POST /api/services - Crear nuevo servicio
router.post("/", ServiceController.createService);

// PUT /api/services/:id - Actualizar servicio
router.put("/:id", ServiceController.updateService);

// DELETE /api/services/:id - Eliminar servicio
router.delete("/:id", ServiceController.deleteService);

module.exports = router;
