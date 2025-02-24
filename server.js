const app = require('express')();

app.get("/", (req, res) => res.send("hello"));


app.get("/stream", (req, res) => {

    res.setHeader("Content-Type", "text/event-stream"); // content type
    res.setHeader('Cache-Control', 'no-cache'); // Prevent caching
    res.setHeader('Connection', 'keep-alive'); // Keep connection open
    send(res);
})

let i = 0;
function send(res) {
    res.write("data: " + `Day ${i++} of enrolling on this platform\n\n`);

    setTimeout(() => send(res), 1000*60*60*24);
}


const PORT = 8080;
app.listen(PORT, () => console.log(`SSE server running on port ${PORT}`));

// app.listen(8080);
// console.log("Listening on 8080");