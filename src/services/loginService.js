require('dotenv').config();
import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE=" + process.env.DB_DATABASE + ";HOSTNAME=" + process.env.DB_HOSTNAME + ";PORT=" + process.env.DB_PORT + ";UID=" + process.env.DB_UID + ";PWD=" + process.env.DB_PWD + ";PROTOCOL=TCPIP;SECURITY=SSL";


let createNewUser = (data) => {
    console.log('loginService: createNewUser')
    return new Promise(async (resolve, reject) => {
        // check phone number exists or not
        let isPhoneExist = await checkExistPhone(data.phone);
        if (isPhoneExist) {
            reject(`This phone "${data.phone}" already exists in our database. Please choose another phone number.`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let pass = bcrypt.hashSync(data.password, salt);
            //create a new account
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("INSERT INTO " + process.env.DB_SCHEMA + ".user_detail (fullname, phone_no, password) values(?, ?, ?);", [data.fullname, data.phone, pass], function (err, rows) {
                    if (err) {
                        reject(false)
                        console.log(err)
                    }
                    resolve("A new user is successfully created");
                })
            });
        }
    })
};

let checkExistPhone = (phone) => {
    console.log('loginService: checkExistPhone')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM " + process.env.DB_SCHEMA + ".user_detail where phone_no=? with ur", [phone], function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let findUserByPhone = (phone) => {
    console.log('loginService: findUserByPhone')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM " + process.env.DB_SCHEMA + ".user_detail WHERE phone_no=? with ur;", [phone], function (err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, user) => {
    console.log('loginService: comparePassword')
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData = JSON.stringify(user)
            const jsonDataObj = JSON.parse(jsonData)
            const jsonPasword = jsonDataObj.PASSWORD
            await bcrypt.compare(password, jsonPasword).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let findUserByAccount = (account) => {
    console.log('loginService: findUserByAccount')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM " + process.env.DB_SCHEMA + ".user_info WHERE account=? with ur;", [account], function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};


module.exports = {
    createNewUser: createNewUser,
    findUserByPhone: findUserByPhone,
    comparePassword: comparePassword,
    findUserByAccount: findUserByAccount
};