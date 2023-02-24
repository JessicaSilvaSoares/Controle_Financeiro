const { DataTypes } = require('sequelize')
const db = require("../db/conn")

const User = db.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Preencha todos os campos'
            },
            isEmail: {
                args: [ true ],
                msg: `O email deve ser no formato "exemplo@email.com"`
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Preencha todos os campos'
            },
        }
    }
},
)

module.exports = User