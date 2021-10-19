var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const seccomp = require('node-seccomp');
const spawn = require("child_process").spawn;
const {stdio, fork, accept, kill, proc} = seccomp;
// app.get('/', (req, res, next) => {
//     res.send("Connected to the server");
//     console.log("Connection");
//     next();
// })

app.get('/', (req, res, next) => {
    res.send("Run program");
    // console.log("Run");
})

io.on("connection", (socket) => {
    
    // var shell = spawn("stdbuf", ["-o0", "./a.out"]);
    var shell = spawn("stdbuf", ["-o0", "python3", "test.py"]);
    // seccomp(proc);
    // var shell = spawn("sudo", ["./libjudger.so", '--exe_path="./a.out"'], {stdio: [0, 1, 2]});
    shell.stdout.on('data', (data) => {
        // console.log("%s", data);
        socket.emit("stdout", data);
    });
    socket.on("stdin", (input) => {
        // console.log("%s", input);
        shell.stdin.write(input + "\n");
    });
    shell.on("exit", (code) => {
        // console.log("child process exited with code " + code);
        socket.emit("exited", code);
    });
});

server.listen(3000, "172.18.54.72", () => {
    console.log("Server opened");
});