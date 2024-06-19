require('dotenv').config();
const ibmdb = require('ibm_db');
let connStr = "DATABASE=" + process.env.DB_DATABASE + ";HOSTNAME=" + process.env.DB_HOSTNAME + ";PORT=" + process.env.DB_PORT + ";UID=" + process.env.DB_UID + ";PWD=" + process.env.DB_PWD + ";PROTOCOL=TCPIP;SECURITY=SSL";


let newPickupService = (pickupinfo) => {
    console.log('profileService: newPickupService')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("INSERT INTO " + process.env.DB_SCHEMA + ".PICKUP_REQUEST (DONOR_ACCOUNT, PLASTIC_BOTTLE, PLASTIC_WRAPPER, GLASS_BOTTLE, METAL_CANS, PAPER_WASTE, OTHER_WASTE, DONOR_COUNTRY, DONOR_STATE, DONOR_CITY, DONOR_PIN_OR_ZIP, DONOR_ADDRESS, DONOR_PHONE_NO) values(?,?,?,?,?,?,?,?,?,?,?,?,?);", [pickupinfo.account, pickupinfo.plasticbottles, pickupinfo.plasticwrapper, pickupinfo.glassbottles, pickupinfo.metalcans, pickupinfo.paperbox, pickupinfo.otherthermocolplasticwaste, pickupinfo.country, pickupinfo.state, pickupinfo.city, pickupinfo.address, pickupinfo.ziporpin, pickupinfo.phone], function (err, rows) {
                if (err) {
                    reject(false)
                    console.log(err)
                }
                resolve("A new pickup request is successfully entered");
            })
        });
    })
};

let updatePickupService = (pickupinfo) => {
    console.log('profileService: updatePickupService')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("UPDATE "+process.env.DB_SCHEMA+".PICKUP_REQUEST SET PLASTIC_BOTTLE = ?, PLASTIC_WRAPPER= ?, GLASS_BOTTLE= ?, METAL_CANS= ?, PAPER_WASTE= ?, OTHER_WASTE= ?, DONOR_COUNTRY= ?, DONOR_STATE= ?, DONOR_CITY= ?, DONOR_PIN_OR_ZIP= ?, DONOR_ADDRESS= ?, DONOR_PHONE_NO= ? where PICKUP_REQUEST_NO = ?;", [pickupinfo.plasticbottles, pickupinfo.plasticwrapper, pickupinfo.glassbottles, pickupinfo.metalcans, pickupinfo.paperbox, pickupinfo.otherthermocolplasticwaste, pickupinfo.country, pickupinfo.state, pickupinfo.city, pickupinfo.ziporpin, pickupinfo.address, pickupinfo.phone, pickupinfo.pickuprequestno], function(err, rows) {
                if (err) {
                    reject(false)
                    console.log(err)
                }
                resolve("Successfully updated pickup request");
            })
        });
    })
};


let fetchPickupRequests = (account) => {
    console.log('profileService: fetchPickupRequests')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                //let count = process.env.FETCH_ROW_COUNT;
                conn.query("SELECT * FROM " + process.env.DB_SCHEMA + ".pickup_request WHERE donor_account=? ORDER BY LAST_UPDATED_TS DESC fetch first 2 rows only with ur;", [account], function (err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    newPickupService: newPickupService,
    updatePickupService: updatePickupService,
    fetchPickupRequests: fetchPickupRequests
};