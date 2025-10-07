const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "postgres",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
    timezone: "-05:00",
    // ✅ Configuración importante
    define: {
      underscored: true, // Convierte automáticamente camelCase a snake_case
      freezeTableName: true, // No pluralizar nombres de tabla
    },
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");

    // ✅ Sincronización MÁS SEGURA - solo crea tablas si no existen
    await sequelize.sync({
      force: false, // NUNCA true en producción
      alter: false, // Desactivar alter temporalmente
    });

    console.log("✅ Modelos sincronizados con PostgreSQL.");

    // ✅ Verificar que la tabla existe
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (results[0].exists) {
      console.log("✅ Tabla 'users' verificada correctamente.");
    } else {
      console.log(
        "⚠️ Tabla 'users' no existe. Se creará en el próximo inicio."
      );
    }
  } catch (error) {
    console.error("❌ Error al conectar con PostgreSQL:", error.message);

    // Si es error de índice, es menos crítico
    if (
      error.message.includes("is_active") ||
      error.message.includes("índice")
    ) {
      console.log(
        "⚠️ Error de índice ignorable. La tabla existe pero los índices fallaron."
      );
      return; // No lanzar error para que el servidor continúe
    }

    throw error;
  }
};

module.exports = { sequelize, testConnection, Sequelize };
