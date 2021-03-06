const WORKSPACE_BASE = "/code/"
const LOG_BASE = "/log/"

const COMPILER_LOG_PATH = LOG_BASE + "compile.log"
const RUN_LOG_PATH = LOG_BASE + "run.log"
const SERVER_LOG_PATH = LOG_BASE + "server.log"

const COMPILE_SUCCESS = 1
const COMPILE_FAIL = 0
module.exports = {WORKSPACE_BASE, COMPILE_SUCCESS, COMPILE_FAIL, COMPILER_LOG_PATH, RUN_LOG_PATH, SERVER_LOG_PATH}