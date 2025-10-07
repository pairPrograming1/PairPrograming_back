const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const FAQ = sequelize.define(
  "FAQ",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    helpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    notHelpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "not_helpful",
    },
  },
  {
    tableName: "faqs",
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
      {
        fields: ["order"],
      },
    ],
  }
);

module.exports = FAQ;
