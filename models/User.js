const Sequelize = require('sequelize')
const { sequelize } = require('../database/connection')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.DataTypes.STRING,
    upload: Sequelize.DataTypes.STRING,
})

module.exports = { User }