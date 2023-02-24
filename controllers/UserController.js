const User = require('../models/User')
const bcrypt = require('bcryptjs')

let message_error
let message_success


module.exports = class UserController {
    static getLogin(req, res) {
        res.render('authentication/login')
    }

    static async postLogin(req, res) {
        const { email, password } = req.body
        const data = {
            email, 
            password
        }
        
        let dataBuild = User.build(data)
        let validateErrors = await dataBuild.validate()
        .catch( (err) => {
            return err.errors
        })

        if( validateErrors.length > 0 ) {
            message_error = validateErrors[0].message
            res.render('authentication/login', { message_error })
            return
        }

        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            message_error = 'Usuário não encontrado'
            res.render('authentication/login', { message_error })
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
            message_error = 'Senha inválida'

            res.render('authentication/login', { message_error })
        }

        req.session.idUser = user.id
        req.session.save(function (error) {
            if (error) {
                return next(error)
            }
            message_success = 'Login realizado com sucesso'
            res.render('dashboard/home', { message_success })
        })
    }

    static getRegister(req, res) {
        res.render('authentication/register')
    }

    static async postRegister(req, res) {
        const { email, password, confirm_password } = req.body

        const data = {
            email, 
            password,
        }
        let dataBuild = User.build(data)

        let validateErrors = await dataBuild.validate()
        .catch( (err) => {
            return err.errors
        })

        if( validateErrors.length > 0 ) {
            message_error = validateErrors[0].message
            res.render( 'authentication/register', { message_error } )
            return
        }

        const userExists = await User.findOne({ where: { email: email } })
        if (userExists) {
            message_error = 'O usuário já está cadastrado'

            res.render('authentication/register', { message_error })
            return
        }

        if (password !== confirm_password) {
            message_error = 'As senhas não conferem'

            res.render('authentication/register', { message_error })
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const password_cript = bcrypt.hashSync(password, salt)

        const user = {
            email,
            password: password_cript
        }

        await User.create(user)
        .then( () => {  
            message_success = 'Cadastro realizado com sucesso'
            res.render('dashboard/home', { message_success })
        })
        .catch( (error) => { console.log( error ) })
        
    }

    static getLogout(req, res) {
        let message_success = 'Logout feito com sucesso'
        req.session.destroy()
        res.render('authentication/login', { message_success })
    }
}