require('dotenv').config();
import express from "express";

import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";

let app = express();
//use cookie parser
app.use(cookieParser('secret'));
//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

//Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//init all web routes
initWebRoutes(app);

let port = process.env.PORT;
app.listen(port, () => console.log(`RecycleNow_Server is running on port ${port}!`));