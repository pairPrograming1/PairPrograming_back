const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Event = sequelize.define(
  "Event",
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
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    type: {
      type: DataTypes.ENUM(
        "reunion",
        "desarrollo",
        "consulta",
        "soporte",
        "mantenimiento"
      ),
      defaultValue: "reunion",
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "in-progress",
        "completed",
        "cancelled"
      ),
      defaultValue: "scheduled",
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "reminder_sent",
    },
  },
  {
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["start_date"],
      },
      {
        fields: ["type"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

module.exports = Event;
