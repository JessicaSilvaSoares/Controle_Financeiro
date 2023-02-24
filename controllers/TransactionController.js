const { raw } = require('mysql2')
const { Op } = require('sequelize')
const db = require('../db/conn')
const Transaction = require('../models/Transaction')

let message_success
let message_error


module.exports = class TransactionController {
    static async getHome(req, res) {
        let UserId = req.session.idUser

        const [results] = await db.query(`SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 1 AND UserId = ${UserId} UNION ALL SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 0 AND UserId = ${UserId}`, function (error, rows) {
            if (error) { console.log(error) }
            return rows
        })
        let incomes = results[0].balance
        let expenses = results[1].balance

        let incomesValue = () => {
            if (incomes === null) {
                let incomes = '0'
                return incomes
            } else {
                return incomes
            }
        }
        let expensesValue = () => {
            if (expenses === null) {
                let expenses = '0'
                return expenses
            } else {
                return expenses
            }
        }
        let balanceValue = () => {
            if (balance === 0) {
                let balance = '0'
                return balance
            } else {
                return balance
            }
        }

        let balance = incomes - expenses

        const historic = await Transaction.findAll({
            where: { UserId: UserId },
            order: [['createdAt', 'DESC']],
            limit: 3,
            raw: true,
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        res.render('dashboard/home', { dataCards: { incomes: incomesValue(), expenses: expensesValue(), balance: balanceValue() }, historic: historic })
    }

    static async getIncomes(req, res) {
        let UserId = req.session.idUser
        const cardIncomes = await Transaction.findAll({
            attributes: [[db.fn('sum', db.col('amount')), 'incomes']],
            where: {
                transaction_type: 1,
                UserId: UserId
            },
            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        const historic = await Transaction.findAll({
            where: {
                transaction_type: 1,
                UserId: UserId
            },
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))


        res.render('dashboard/incomes', { cardIncomes: cardIncomes[0].incomes, historic: historic })
    }
    static async getExpenses(req, res) {
        let UserId = req.session.idUser
        const cardExpenses = await Transaction.findAll({
            attributes: [[db.fn('sum', db.col('amount')), 'expenses']],
            where: {
                transaction_type: 0,
                UserId: UserId
            },
            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))

        const historic = await Transaction.findAll({
            where: {
                transaction_type: 0,
                UserId: UserId
            },
            raw: true
        })
            .then((data) => {
                return data
            })
            .catch((error) => console.log(error))


        res.render('dashboard/expenses', { cardExpenses: cardExpenses[0].expenses, historic: historic })
    }


    static getCreate(req, res) {
        res.render('dashboard/create')
    }
    static async postCreate(req, res) {
        let UserId = req.session.idUser
        const { transaction_type, description, amount } = req.body

        const dataValidate = {
            transaction_type, 
            description, 
            amount
        }

        let dataBuild = Transaction.build(dataValidate)
        let validateErrors = await dataBuild.validate()
            .catch((err) => {
                return err.errors
            })

        if (validateErrors.length > 0) {
            let message_error = validateErrors[0].message
            res.render('dashboard/create', { message_error })
            return
        }

        let booleanType = () => {
            if (transaction_type === 'income') {
                return true
            } else if (transaction_type === 'expense') {
                return false
            }
        }

        const [income] = await db.query(`SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 1 AND UserId = ${UserId} UNION ALL SELECT SUM(amount) AS balance FROM transactions WHERE transaction_type = 0 AND UserId = ${UserId}`, function (err, rows) {
            if (err) { console.log(err) }
            else {
                return rows
            }
        })

        let value = () => {
            let newAmount = amount.replace(',', '.')

            let incomes = income[0].balance
            let expenses = income[1].balance
            let balance = incomes - expenses

            let newBalance = balance - newAmount

            if (booleanType() === false && newBalance < 0) {
                let message_error = 'Não tem saldo suficiente para fazer essa transação'
                res.render('dashboard/create', { message_error })
                return
            }
            return newAmount
        }

        const data = {
            transaction_type: booleanType(),
            description,
            amount: value(),
            UserId: UserId
        }
        await Transaction.create(data)
            .then(res.redirect('/transactions/dashboard'))
            .catch((error) => error.errors)
    }

    static async getDetails(req, res) {
        let UserId = req.session.idUser
        let searchQuery = ''

        if (req.query.search) {
            searchQuery = req.query.search
        }

        await Transaction.findAll({
            where: {
                description: { [Op.like]: `%${searchQuery}%` },
                UserId: UserId
            },
            order: [['createdAt', 'ASC']],
            raw: true
        })
            .then((data) => {
                let transactionsQtd = data.length
                if (transactionsQtd === 0) {
                    message_error = 'Nenhuma transação encontrada'
                    res.render( 'dashboard/search', { message_error } )
                }

                res.render('dashboard/search', { searchQuery, transactionsQtd, data: data })
            })
    }


    static getEdit(req, res) {
        const id = req.params.id
        Transaction.findOne({ where: { id: id }, raw: true })
            .then((data) => {
                res.render('dashboard/edit', { data })
            })
            .catch((error) => console.log(error))

    }
    static async postEdit(req, res) {
        const id = req.params.id

        let booleanType = () => {
            let type = req.body.transaction_type
            if (type === 'income') {
                return true
            } else if (type === 'expense') {
                return false
            }
        }
        let value = () => {
            let amount = req.body.amount
            let newAmount = amount.replace(',', '.')
            return newAmount
        }
        const data = {
            transaction_type: booleanType(),
            description: req.body.description,
            amount: value(),
        }

        await Transaction.update(data, { where: { id: id }, raw: true })
            .then(() => {
                res.redirect('/transactions/historic')
            })
            .catch((error) => console.log(error))
    }


    static async getHistoric(req, res) {
        let UserId = req.session.idUser

        await Transaction.findAll({
            raw: true,
            order: [['createdAt', 'DESC']],
            where: { UserId: UserId }
        })
            .then((data) => {
                res.render('dashboard/transactions', { transaction: data })
            })
            .catch((error) => console.log(error))
    }

    static async postDelete(req, res) {
        let UserId = req.session.idUser

        const id = req.params.id
        await Transaction.destroy({
            where: {
                id: id,
                UserId: UserId
            }
        })
            .then(res.redirect('/transactions/dashboard'))
            .catch((error) => console.log(error))
    }
}