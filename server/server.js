var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var fs = require("fs");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const pty = require("node-pty");
const execSync = require("child_process").execSync;
// app.get('/', (req, res, next) => {
//     res.send("Connected to the server");
//     console.log("Connection");
//     next();
// })
app.use(require('cors')());
app.use(jsonParser);
app.get('/', (req, res) => {
    res.send("Run program");
})

app.post('/compile', (req, res) => {
    // var compile_err = null;
    // var compile_exit_code = null;
    function compile_response(compile_err=null) {
        if (compile_err !== null) {
            res.send({"Compile error": compile_err});
        } else {
            res.send("Compile Success");
        }
    }
    function systemSync() {
        try {
            var compile = execSync("/usr/bin/gcc /tmp/main.c");
            // compile.stderr.on('data', (data) => {
            //     console.log("%s", data);
            //     compile_err = data;
            // });
            // compile.on("exit", (data) => {
            //     compile_exit_code = data;
            // })
            console.log(compile);
            compile_response(compile);
        } catch (err) {
            compile_response(err);
            // console.log(err);
        }
    }
    
    var file = "/tmp/main.c";
    console.log(req.body);
    fs.writeFile(file, req.body.code, 'utf8', (err) => {
        if(err) throw err;
        console.log("code write");
        systemSync();
    })
    
    
    // console.log(compile_err)
    
    // res.send({''});
})
io.on("connection", (socket) => {
    // var shell = pty.spawn("./libjudger.so", ['--exe_path=/usr/bin/python3', '--args=test.py', '--seccomp_rule_name=general']);
    var shell = pty.spawn("./libjudger.so", ['--exe_path=./a.out', '--seccomp_rule_name=c_cpp']);
    shell.on('data', (data) => {
        console.log("%s", data);
        socket.emit("stdout", data);
    });
    socket.on("stdin", (input) => {
        console.log("%s", input);
        shell.write(input + "\n");
    });
    shell.on("exit", (code) => {
        console.log("child process exited with code " + code);
        socket.emit("exited", code);
    });
});

server.listen(3000, () => {
    console.log("Server opened");
});