// const app = require('express')();

// app.get("/", (req, res) => res.send("hello"));


// app.get("/stream", (req, res) => {

//     res.setHeader("Content-Type", "text/event-stream"); // content type
//     res.setHeader('Cache-Control', 'no-cache'); // Prevent caching
//     res.setHeader('Connection', 'keep-alive'); // Keep connection open
//     send(res);
// })

// let i = 0;
// function send(res) {
//     res.write("data: " + `Day ${i++} of enrolling on this platform\n\n`);

//     setTimeout(() => send(res), 1000*60*60*24);
// }


// const PORT = 8080;
// app.listen(PORT, () => console.log(`SSE server running on port ${PORT}`));

// // app.listen(8080);
// // console.log("Listening on 8080");


const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middlewares
app.use(session({
    secret: 'lms',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const clients = {};

// SSE endpoint
app.get('/events', (req, res) => {
    const sessionId = req.sessionID;

    // responses headers for SSE
    app.use((req, res, next) => {
        res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000");
        next();
    });
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Store response object in clients list
    clients[sessionId] = res;

    // Send an initial msg
    res.write(`data: Welcome user with session ${sessionId}!\n\n`);

    //  Handle DIsconnect
    req.on('close', () => {
        delete clients[sessionId];
    });
});

// Send personalized messages to user every 5 seconds
setInterval(() => {
    Object.keys(clients).forEach(sessionId => {
        clients[sessionId].write(`data: Hello user ${sessionId}, your personalized message at ${new Date().toLocaleTimeString()}\n\n`);
    });
}, 5000);

app.listen(PORT, () => console.log(`SSE server running on http://localhost:${PORT}`));