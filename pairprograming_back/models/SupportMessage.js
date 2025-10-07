const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const SupportMessage = sequelize.define(
  "SupportMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ticket_id",
      references: {
        model: "support_tickets",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.ENUM("customer", "agent"),
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "sender_name",
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_internal",
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    tableName: "support_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["ticket_id"],
      },
      {
        fields: ["sender"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

SupportMessage.associate = function (models) {
  SupportMessage.belongsTo(models.SupportTicket, {
    foreignKey: "ticket_id",
    as: "ticket",
  });
};

module.exports = SupportMessage;
