<template>
  <div>
    <h1>Code</h1>
    <form>
      <p><textarea cols="100" rows="20" v-model="code"></textarea></p>
      <button type="button" value="Connect" @click="compile()">compile</button>
    </form>
    <h1>Run</h1>
    <form>
      <button type="button" value="Connect" @click="run()">Run</button>
    </form>
    <h1> stdin </h1>
    <form>
      <input type="text" v-model="stdin">
      <button type="button" value="input" @click="postStdin()">input</button>
    </form>
    <h1> stdout </h1>
    <p>{{ stdout }}</p>
    <h1> stderr </h1>
    <p>{{ stderr }}</p>
    <h1> exit code </h1>
    <p>{{ exitcode }}</p>
  </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'
export default {
    name: 'socket',
    data () {
        return {
            stdin: '',
            stdout: '',
            stderr: '',
            socket: '',
            encoder: '',
            exitcode: '',
            code: '',
            compileResult: '',
            dir: null,
            lang: "cpp"
        }
    },
    methods: {
        run () {
          if(this.dir === null){
            console.log("Not compiled yet")
            return
          }
          this.stdout = ''
          this.stderr = ''
          this.socket = io.connect('http://localhost:8900', { reconnection: false, query: {'token':this.dir, 'lang': this.lang} })
          this.socket.on('stdout', (output) => {
            this.stdout += '\n' + output
          })
          this.socket.on('exited', (code) => {
            this.exitcode += code
            // this.socket.disconnect();
          })
        },
        postStdin () {
          this.socket.emit('stdin', this.stdin)
        },
        async compile () {
          try {
            const res = await axios.post('http://localhost:8900/compile', {'lang': this.lang, 'code': this.code})
            console.log(res.data)
            this.stderr = ''
            if (res.data.status !== 1) {
              this.stderr = res.data.output
            } else {
              this.dir = res.data.output
            }
          } catch (err) {
            console.log(err)
          }
        }
    }
}
</script>