import loginService from "../services/loginService";
const jwt = require('jsonwebtoken')

let getPageLogin = async (req, res, next) => {
    console.log('loginController: getPageLogin')
    let userinfo = {
        phone: req.body.phone,
        password: req.body.password
    };
    try {
        await loginService.findUserByPhone(userinfo.phone).then(async (user) => {
            if (!user) {
                res.status(401).send({ "e": "Phone '${userinfo.phone}' doesn't exist" })
            } else {
                if (user) {
                    let match = await loginService.comparePassword(userinfo.password, user);
                    if (match === true) {
                        const token = jwt.sign({ account: user.ACCOUNT, usertype: user.USER_TYPE }, 'abcdefghijk');
                        //const decode = jwt.verify(token, 'abcdefghijk');
                        const data = {
                            user: user,
                            token: token,
                            usertype: user.USER_TYPE
                        }
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
        console.log(err)
        return done(null, false, { message: err });
    }
};


let createNewUser = async (req, res) => {
    console.log('loginController: createNewUser')
    let newUser = {
        fullname: req.body.fullname,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        usertype: req.body.usertype

    };

    try {
        await loginService.createNewUser(newUser);
        const token = jwt.sign({ phone: 'req.body.phone' }, 'abcdefghijk');
        /* STARTS - This block of code is done to avoid error when user registers for the 1st time */
        let user = {
            FULLNAME : newUser.fullname
        }
        /* ENDS */
        const data = {
            user: user,
            token: token,
            usertype: req.body.usertype
        }
        return res.send(data)
    } catch (err) {
        req.flash("errors", err);
        console.log('err:', +err)
        return res.json({
            "message": err
        });
    }
};


let postLogOut = (req, res) => {
    console.log('loginController: postLogOut')
    console.log(req.headers.authorization)
    req.session.destroy(function (err) {
        return res.redirect("/");
    });
};

module.exports = {
    getPageLogin: getPageLogin,
    createNewUser: createNewUser,
    postLogOut: postLogOut
};