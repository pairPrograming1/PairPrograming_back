const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar la configuración de la base de datos
const { testConnection, syncDatabase } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando correctamente con PostgreSQL",
    database: "PostgreSQL",
    version: "1.0.0",
    endpoints: [
      "/api/users",
      "/api/projects",
      "/api/services",
      "/api/contact",
      "/api/events",
      "/api/faqs",
      "/api/support",
    ],
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    const sequelize = require("./config/sequelize");
    await sequelize.authenticate();

    res.json({
      status: "OK",
      database: "PostgreSQL connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      database: "PostgreSQL connection failed",
      error: error.message,
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Iniciar servidor y conectar a la base de datos
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);

  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log("🚀 Servidor listo para recibir requests");

      // Sincronizar modelos
      await syncDatabase();
      console.log("✅ Modelos sincronizados con PostgreSQL");
    }
  } catch (error) {
    console.log(
      "⚠️ Error en conexión DB, pero servidor iniciado:",
      error.message
    );
  }
});

module.exports = app;
