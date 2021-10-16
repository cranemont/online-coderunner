var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const spawn = require("child_process").spawn;

// app.get('/', (req, res, next) => {
//     res.send("Connected to the server");
//     console.log("Connection");
//     next();
// })

app.get('/', (req, res, next) => {
    res.send("Run program");
    console.log("Run");
})

io.on("connection", (socket) => {
    // var shell = spawn("stdbuf", ["-o0", "./a.out"]);
    var shell = spawn("stdbuf", ["-o0", "python3", "test.py"]);
    shell.stdout.on('data', (data) => {
        console.log("%s", data);
        socket.emit("stdout", data);
    });
    socket.on("stdin", (input) => {
        console.log("%s", input);
        shell.stdin.write(input + "\n");
    });
    shell.on("exited", (code) => {
        console.log("child process exited with code " + code);
        socket.emit("exited", code);
    });
});

server.listen(3000, "172.29.11.80", () => {
    console.log("Server opened");
});