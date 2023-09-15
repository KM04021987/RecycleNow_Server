import loginService from "../services/loginService";
const jwt = require('jsonwebtoken')

let getPageLogin = async (req, res, next) => {
    console.log('loginController: getPageLogin')
    let userinfo = {
        phone: req.body.phone,
        password: req.body.password
    };
    console.log(userinfo)
    try {
        await loginService.findUserByPhone(userinfo.phone).then(async (user) => {
            if (!user) {
                console.log('Phone does not exists')
                res.status(401).send({ "e": "Phone '${userinfo.phone}' doesn't exist" })
            } else {
                if (user) {
                    let match = await loginService.comparePassword(userinfo.password, user);
                    if (match === true) {
                        console.log(user.ACCOUNT)
                        const token = jwt.sign({ account: user.ACCOUNT, usertype: user.USER_TYPE }, 'abcdefghijk');
                        console.log(token);
                        const decode = jwt.verify(token, 'abcdefghijk');
                        console.log(decode)
                        const data = {
                            token: token,
                            usertype: user.USER_TYPE
                        }
                        console.log(data)
                        return res.send(data)
                    } else {
                        return res.json({
                            "message": err
                        });
                    }
                }
            }
        });
    } catch (err) {
        console.log('it is here')
        console.log(err)
        return done(null, false, { message: err });
    }
};


let createNewUser = async (req, res) => {
    console.log('loginController: createNewUser')
    //validate required fields
    /*let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }*/

    //create a new user
    let newUser = {
        fullname: req.body.fullname,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        usertype: req.body.usertype

    };
    console.log(newUser)

    try {
        await loginService.createNewUser(newUser);
        const token = jwt.sign({ phone: 'req.body.phone' }, 'abcdefghijk');
        console.log(token);
        const data = {
            token: token,
            usertype: " "
        }
        console.log(data)
        return res.send(data)
    } catch (err) {
        req.flash("errors", err);
        console.log('err:', +err)
        return res.json({
            "message": err
        });
    }
};

let checkLoggedIn = (req, res, next) => {
    console.log('loginController: checkLoggedIn')
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log('loginController: checkLoggedOut')
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    console.log('loginController: postLogOut')
    console.log(req.headers.authorization)
    req.session.destroy(function (err) {
        return res.redirect("/");
    });
};

let registercompletedonor = async (req, res) => {
    console.log('loginController: registercompletedonor')

    console.log(req.headers.authorization)
    const temp = req.headers.authorization
    const token = temp.substring(7)
    console.log(token)
    const decode = jwt.verify(token, 'abcdefghijk');
    console.log(decode)
    const account = decode.account
    console.log(account)

    try {
        //await loginService.registercompletedonor(account);
        //const token = jwt.sign({ phone: 'req.body.phone' }, 'abcdefghijk');
        console.log(token);
        const data = {
            token: token,
            usertype: "D"
        }
        console.log(data)
        return res.send(data)
    } catch (err) {
        req.flash("errors", err);
        console.log('err:', +err)
        return res.json({
            "message": err
        });
    }
    /*
    req.session.destroy(function(err) {
        return res.redirect("/");
    });
    
    let newUser = {
        fullname: req.body.fullname,
        phone: req.body.phone,
        password: req.body.password
    };
    
    try {
        await loginService.createNewUser(newUser);
        const token = jwt.sign({ phone: 'req.body.phone' }, 'abcdefghijk');
        console.log(token);
        const data = {
            token: token, 
            usertype: " "  
        }
        console.log(data)
        return res.send(data)
    } catch (err) {
        req.flash("errors", err);
        console.log('err:',+err)
        return res.json({
            "message": err
        });
    }*/
};

module.exports = {
    getPageLogin: getPageLogin,
    createNewUser: createNewUser,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut,
    registercompletedonor: registercompletedonor
};