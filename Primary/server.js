const express = require('express'); // express.js package
const apiRouter = require('./route-handlers/api'); // require api.html from the routes directory
const homeRouter = require('./route-handlers/home'); // require api.html from the routes directory

const app = express(); // initialize express to start application
const PORT = process.env.PORT || 3001; // run on PORT number specified in env variable named PORT. otherwise run on PORT 3001

// app.use: express.js method. mounts middleware functions in the request response cycle.
// middleware functions have access to `req` (request obj), `res` (response obj), and the next middleware function in the req/res cycle
app.use(express.json()); // parse incoming JSON requests [express.json() is an Express.js built-in middleware function]
app.use(express.urlencoded({ extended: true })); // parse incoming URL encoded data. [express.urlencoded() is an Express.js built-in middleware function]
app.use(express.static('public')); // serve static files from the `public` directory, essentially assets
app.use('/api', apiRouter); // requests to paths beginning with `/api` will use apiRouter.js route-handler which was exported and define above
app.use('/', homeRouter); // requests to paths beginning with `/` will use htmlRouter.js as route-handler

app.listen(PORT, () => console.log(`PORT: ${PORT}, listening...`)); // create server, listen on port, log a message