const express = require("express");
const router = express.Router();
const SupportController = require("../controllers/supportController");

// GET /api/support/tickets - Obtener todos los tickets
router.get("/tickets", SupportController.getTickets);

// GET /api/support/tickets/stats - Obtener estadísticas de soporte
router.get("/tickets/stats", SupportController.getSupportStats);

// GET /api/support/tickets/:id - Obtener ticket por ID
router.get("/tickets/:id", SupportController.getTicket);

// POST /api/support/tickets - Crear nuevo ticket
router.post("/tickets", SupportController.createTicket);

// POST /api/support/tickets/:id/messages - Agregar mensaje al ticket
router.post("/tickets/:id/messages", SupportController.addMessage);

// PUT /api/support/tickets/:id/status - Actualizar estado del ticket
router.put("/tickets/:id/status", SupportController.updateTicketStatus);

module.exports = router;
