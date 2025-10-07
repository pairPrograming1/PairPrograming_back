const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    category: {
      type: DataTypes.ENUM("productos", "servicios", "soluciones"),
      allowNull: false,
    },
    priceRange: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "price_range",
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["is_active"],
      },
    ],
  }
);

module.exports = Service;
