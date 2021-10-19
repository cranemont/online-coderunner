var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const pty = require("node-pty");

app.get('/', (req, res, next) => {
    res.send("Run program");
    // console.log("Run");
})

io.on("connection", (socket) => {
    
    // var shell = spawn("stdbuf", ["-o0", "./a.out"]);
    var shell = pty.spawn("/usr/lib/judge/libjudger.so", ["--exe_path=./compile/a.out"]);
    // seccomp(proc);
    // var shell = spawn("sudo", ["./libjudger.so", '--exe_path="./a.out"'], {stdio: [0, 1, 2]});
    shell.on('data', (data) => {
        // console.log("%s", data);
        socket.emit("stdout", data);
    });
    socket.on("stdin", (input) => {
        // console.log("%s", input);
        shell.write(input + "\n");
    });
    shell.on("exit", (code) => {
        // console.log("child process exited with code " + code);
        socket.emit("exited", code);
    });
});

server.listen(3000, () => {
    console.log("Server opened");
});