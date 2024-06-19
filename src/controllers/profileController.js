import profileService from "../services/profileService";

let newPickup = async (req, res) => {
    console.log('profileController: newPickup')
    let pickupinfo = {
        account: req.body.account,
        plasticbottles: req.body.plasticbottles,
        plasticwrapper: req.body.plasticwrapper,
        glassbottles: req.body.glassbottles,
        metalcans: req.body.metalcans,
        paperbox: req.body.paperbox,
        otherthermocolplasticwaste: req.body.otherthermocolplasticwaste,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        ziporpin: req.body.ziporpin,
        phone: req.body.phone
    };

    try {
        await profileService.newPickupService(pickupinfo);
        try {
            profileService.fetchPickupRequests(pickupinfo.account).then((pickupdata) => {
                const data = {
                    user: req.body.saveduser,
                    token: req.body.savedtoken,
                    usertype: req.body.savedusertype,
                    pickupdata: pickupdata
                }
                return res.send(data)
            })
        } catch (err) {
            req.flash("errors", err);
            console.log(err)
            return res.json({
                "message": err
            });
        }
    } catch (err) {
        req.flash("errors", err);
        console.log(err)
        return res.json({
            "message": err
        });
    }
};

let updatePickup = async (req, res) => {
    console.log('profileController: updatePickup')
    let pickupinfo = {
        account: req.body.account,
        plasticbottles: req.body.plasticbottles,
        plasticwrapper: req.body.plasticwrapper,
        glassbottles: req.body.glassbottles,
        metalcans: req.body.metalcans,
        paperbox: req.body.paperbox,
        otherthermocolplasticwaste: req.body.otherthermocolplasticwaste,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        ziporpin: req.body.ziporpin,
        phone: req.body.phone,
        pickuprequestno: req.body.pickuprequestno
    };  

    try {
        await profileService.updatePickupService(pickupinfo);
        try {
            profileService.fetchPickupRequests(pickupinfo.account).then((pickupdata) => {
                const data = {
                    user: req.body.saveduser,
                    token: req.body.savedtoken,
                    usertype: req.body.savedusertype,
                    pickupdata: pickupdata
                }
                return res.send(data)
            })
        } catch (err) {
            req.flash("errors", err);
            console.log(err)
            return res.json({
                "message": err
            });
        }
    } catch (err) {
        req.flash("errors", err);
        console.log(err)
        return res.json({
            "message": err
        });
    }
};



module.exports = {
    newPickup: newPickup,
    updatePickup: updatePickup
};