const http = require('http');
const express = require('express');
const cors = require('cors')
const logging = require('./config/logging');
const config = require('./config/config');
const mongoose = require('mongoose');
const apiEntry = require('./routes/main.routes');
const middleware = require('./middleware/decode_token.middleware');
const errorHandler = require('./middleware/error-handler.middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const NAMESPACE = 'Server';
const app = express();

// /** Connect to Mongo */
// mongoose
//     .connect('mongodb://localhost/telstra')
//     .then((result) => {
//         logging.info(NAMESPACE, 'Mongo Connected');
//     })
//     .catch((error) => {
//         logging.error(NAMESPACE, error.message, error);
//     });

// var whitelist = ['http://localhost:8080', 'http://localhost:59737']
var whitelist = ['http://localhost:4200', 'http://localhost:59737'] //Local

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))

app.use(cors())


/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })
    
    next();
});

// create test user in db on startup if required
const createTestUser = require('./helpers/create-test-user');
createTestUser();

/** Parse the body of the request */
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(cookieParser());

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('Origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// app.use(middleware.decodeToken);

/** Routes go here */
app.use('/api', apiEntry);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

app.use(errorHandler);

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));