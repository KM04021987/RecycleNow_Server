import express from "express";
import loginController from "../controllers/loginController"

let router = express.Router();

let initWebRoutes = (app) => {

    router.get("/", (req, res) => {
        res.json({ message: "Hello from server!" });
    });

    /*Register, Login Authentication & Logout - Starts*/
    router.post("/register", loginController.createNewUser);
    router.post("/login", loginController.getPageLogin);

    router.post("/logout", loginController.postLogOut);

    /*Register, Login Authentication & Logout - Ends*/

    return app.use("/", router);
};

module.exports = initWebRoutes;