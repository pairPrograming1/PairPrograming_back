const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "ID único del usuario",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre no puede estar vacío",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: "users_email_unique",
        msg: "El email ya está registrado",
      },
      validate: {
        isEmail: {
          msg: "Debe proporcionar un email válido",
        },
        notEmpty: {
          msg: "El email no puede estar vacío",
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: "La edad no puede ser negativa",
        },
        max: {
          args: [120],
          msg: "La edad no puede ser mayor a 120",
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active", // ✅ Nombre real en la base de datos
      comment: "Indica si el usuario está activo",
    },
    profileData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: "profile_data", // ✅ Nombre real en la base de datos
      comment: "Datos adicionales del usuario en formato JSON",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // ✅ REMOVER los índices problemáticos temporalmente
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "users_email_unique",
      },
      // Comentar los otros índices hasta que la tabla exista
      // {
      //   fields: ["isActive"],
      //   name: "users_is_active_idx"
      // },
      // {
      //   fields: ["createdAt"],
      //   name: "users_created_at_idx"
      // },
    ],
    comment: "Tabla de usuarios del sistema",
  }
);

// Métodos de instancia
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

// Métodos estáticos
User.findActiveUsers = function () {
  return this.findAll({
    where: { isActive: true },
    order: [["created_at", "DESC"]],
  });
};

User.findByEmail = function (email) {
  return this.findOne({
    where: { email: email.toLowerCase() },
  });
};

module.exports = User;
