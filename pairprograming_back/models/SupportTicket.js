const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const SupportTicket = sequelize.define(
  "SupportTicket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketNumber: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      field: "ticket_number",
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("technical", "billing", "feature", "bug", "general"),
      defaultValue: "general",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "urgent"),
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.ENUM("open", "in-progress", "resolved", "closed"),
      defaultValue: "open",
    },
    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "customer_email",
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "customer_name",
    },
    assignedTo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "assigned_to",
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "resolved_at",
    },
  },
  {
    tableName: "support_tickets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["ticket_number"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["priority"],
      },
      {
        fields: ["category"],
      },
    ],
  }
);

module.exports = SupportTicket;
