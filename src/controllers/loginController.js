import loginService from "../services/loginService";
import profileService from "../services/profileService";
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
                        profileService.fetchPickupRequests(user.ACCOUNT).then((pickupdata) => {
                            const data = {
                                user: user,
                                token: token,
                                usertype: user.USER_TYPE,
                                pickupdata: pickupdata
                            }
                            return res.send(data)
                        })
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

    let isPhoneExist = await loginService.checkExistPhone(newUser.phone);
    if (isPhoneExist) {
        res.status(401).send({ "e": "This phone already exists. Please use other phone number." })
    }
    else {
        try {
            await loginService.createNewUser(newUser);
            return res.status(200).send({ "msg": "Successfully Registered!" })
        } catch (err) {
            console.log(err)
            res.status(402).send({ "e": "Error Occured duing registration!" })
        }
    }
};


let postLogOut = (req, res) => {
    console.log('loginController: postLogOut')
    req.session.destroy(function (err) {
        return res.redirect("/");
    });
};

module.exports = {
    getPageLogin: getPageLogin,
    createNewUser: createNewUser,
    postLogOut: postLogOut
};