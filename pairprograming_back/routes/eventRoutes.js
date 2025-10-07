const express = require("express");
const router = express.Router();
const EventController = require("../controllers/eventController");

// GET /api/events - Obtener todos los eventos
router.get("/", EventController.getEvents);

// GET /api/events/upcoming - Obtener eventos próximos
router.get("/upcoming", EventController.getUpcomingEvents);

// GET /api/events/:id - Obtener evento por ID
router.get("/:id", EventController.getEvent);

// POST /api/events - Crear nuevo evento
router.post("/", EventController.createEvent);

// PUT /api/events/:id - Actualizar evento
router.put("/:id", EventController.updateEvent);

// DELETE /api/events/:id - Eliminar evento
router.delete("/:id", EventController.deleteEvent);

module.exports = router;
