const sequelize = require("./sequelize");

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");
    return true;
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    return false;
  }
};

// Sincronizar todos los modelos
const syncDatabase = async () => {
  try {
    // Importar modelos aquí para evitar dependencias circulares
    const User = require("../models/User");
    const Project = require("../models/Project");
    const Service = require("../models/Service");
    const ContactMessage = require("../models/ContactMessage");
    const Event = require("../models/Event");
    const FAQ = require("../models/FAQ");
    const SupportTicket = require("../models/SupportTicket");
    const SupportMessage = require("../models/SupportMessage");

    await sequelize.sync({ force: false, alter: false });
    console.log("✅ Todos los modelos fueron sincronizados correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar los modelos:", error);
  }
};

module.exports = { sequelize, testConnection, syncDatabase };
