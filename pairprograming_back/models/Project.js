const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Project = sequelize.define(
  "Project",
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
    youtubeId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "youtube_id",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "archived"),
      defaultValue: "active",
    },
    demoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "demo_url",
    },
    githubUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "github_url",
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["featured"],
      },
    ],
  }
);

module.exports = Project;
