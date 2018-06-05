module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next(); // Next middleware
        }
        req.flash('error_msg', 'Not Authorized, Please Login!');
        res.redirect('/users/login');
    }
}