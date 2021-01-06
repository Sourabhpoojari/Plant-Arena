const  isLoggedIn = (req,res,next)=>{
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        else{
            req.flash('error','You have to login to do that!');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(err);
        return res.status(500).send('auth error');
    }
    
}

exports.isLoggedIn = isLoggedIn;