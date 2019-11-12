const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const Memcached = require('memcached');

const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const searchRouter = require('./routes/search');

const app = express();

mongoose.connect('mongodb://localhost:27017/twitter', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
require('./config/passport');

const memcached = new Memcached('localhost:11211');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180 * 60 * 1000 },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.get("/*", function(req, res, next) {
    if(req.headers['user-agent'] != undefined && req.headers['requestfrom'] !== 'axios') {
        return res.sendFile(path.join(__dirname, './public', 'index.html'));
    }
    next();
});

app.get("/*", async function(req, res, next) {
    const key = req.url;
    memcached.get(key, function (err, data) {
        if(err || !data) {
            const json = res.json;
            res.json = async function(body) {
                memcached.set(key, body, 10, function(err) {});
                json.call(this, body);
            }
            next();
        }
        else {
            res.json(data);
            return;
        }
    });
});

//new item router
app.use('/', itemRouter);
app.use('/', userRouter);
app.use('/', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    return res.json({
        status: "error",
        error: err 
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;
