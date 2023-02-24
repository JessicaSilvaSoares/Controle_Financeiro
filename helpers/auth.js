module.exports.checkAuth = function ( req, res, next ) {

    const sessionIdUser = req.session.idUser

    if( !sessionIdUser || sessionIdUser === undefined ) {
        let message_error = 'O usuário não está logado'
        res.render('authentication/login', {message_error})
        return
    }

    next()
}