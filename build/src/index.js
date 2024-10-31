const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const moment = require("moment");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require('cors');
const cronJobs = require('../../cron/cronJobs.js');
require("dotenv").config();
const database = require('../../config/database');
database.connect();
const clientRoute = require("../../routes/client/index.route");
const adminRoute = require("../../routes/admin/index.route");
const systemPrefix = require("../../config/system");
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT;

// cookies
app.use(cookieParser('KWJFKWEIFHW'));
app.use(session({
    cookie: {
        maxAge: 60000
    }
}));
app.use(express.static('public'));
// override
app.use(methodOverride('_method'));
const corsOptions = {
    origin: ['https://luanvan-fe-3nzp.vercel.app', 'https://luanvan-fe-3nzp-git-master-hoang-hans-projects.vercel.app', 'https://luanvan-fe-3nzp-jlpirbmfq-hoang-hans-projects.vercel.app'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true // nếu bạn sử dụng cookie
};
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());

// Flash
// app.use(cookieParser('KWJFKWEIFHW'));
// app.use(session({ cookie: { maxAge: 60000 }}));
// app.use(flash());
// End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, "node_modules", "tinymce")));
// End TinyMCE

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
app.get('/', async(req, res) => {
    const dbState = mongoose.connection.readyState;
    const status = dbState === 1 ? 'connected' : 'disconnected';
    res.json({
        database: status
    });
});

// Variables
app.locals.adminPrefix = systemPrefix.adminPrefix;
app.locals.moment = moment;

// Routes
clientRoute(app);
adminRoute(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});