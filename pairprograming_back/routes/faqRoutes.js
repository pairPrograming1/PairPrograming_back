const express = require("express");
const router = express.Router();
const FAQController = require("../controllers/faqController");

// GET /api/faqs - Obtener todas las FAQs
router.get("/", FAQController.getFAQs);

// GET /api/faqs/categories - Obtener categorías de FAQs
router.get("/categories", FAQController.getFAQCategories);

// GET /api/faqs/:id - Obtener FAQ por ID
router.get("/:id", FAQController.getFAQ);

// POST /api/faqs - Crear nueva FAQ
router.post("/", FAQController.createFAQ);

// PUT /api/faqs/:id - Actualizar FAQ
router.put("/:id", FAQController.updateFAQ);

// DELETE /api/faqs/:id - Eliminar FAQ
router.delete("/:id", FAQController.deleteFAQ);

// PUT /api/faqs/:id/feedback - Agregar feedback a FAQ
router.put("/:id/feedback", FAQController.addFAQFeedback);

module.exports = router;
