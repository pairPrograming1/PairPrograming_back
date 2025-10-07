const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contactController");

// GET /api/contact/messages - Obtener todos los mensajes
router.get("/messages", ContactController.getMessages);

// GET /api/contact/messages/stats - Obtener estadísticas de mensajes
router.get("/messages/stats", ContactController.getMessagesStats);

// GET /api/contact/messages/:id - Obtener mensaje por ID
router.get("/messages/:id", ContactController.getMessage);

// POST /api/contact/messages - Crear nuevo mensaje
router.post("/messages", ContactController.createMessage);

// PUT /api/contact/messages/:id/status - Actualizar estado del mensaje
router.put("/messages/:id/status", ContactController.updateMessageStatus);

module.exports = router;
