const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar la configuración de la base de datos
const { testConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando correctamente con PostgreSQL",
    database: "PostgreSQL",
  });
});

// Health check mejorado
app.get("/health", async (req, res) => {
  try {
    const { sequelize } = require("./config/database");

    // Verificar conexión a la base de datos
    await sequelize.authenticate();

    // Verificar si la tabla users existe
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const tableExists = results[0].exists;

    res.json({
      status: "OK",
      database: "PostgreSQL connected",
      table_users: tableExists ? "EXISTS" : "MISSING",
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

// Ruta para crear la tabla manualmente si es necesario
app.post("/api/admin/create-tables", async (req, res) => {
  try {
    const { sequelize } = require("./config/database");

    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER,
        is_active BOOLEAN DEFAULT true,
        profile_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sequelize.query(query);

    res.json({
      success: true,
      message: "Tabla 'users' creada/verificada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Iniciar servidor y conectar a la base de datos
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);

  try {
    await testConnection();
    console.log("🚀 Servidor listo para recibir requests");
  } catch (error) {
    console.log(
      "⚠️ Error en conexión DB, pero servidor iniciado:",
      error.message
    );
    console.log(
      "💡 Usa POST /api/admin/create-tables para crear la tabla manualmente"
    );
  }
});
