<template>
  <div>
    <form>
      <h1>Connect</h1>
      <button type="button" value="Connect" @click="run()">Run</button>
    </form>
    <form>
      <h1>Disconnect</h1>
      <button type="button" value="Disconnect" @click="disconnect()">Disconnect</button>
    </form>
    <h2> stdin </h2>
    <form>
      <input type="text" v-model="stdin">
      <button type="button" value="input" @click="postStdin()" />
    </form>
    <h2> stdout </h2>
    {{ stdout }}
    {{ exitcode }}
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    name: 'socket',
    data () {
        return {
            stdin: '',
            stdout: '',
            socket: '',
            encoder: '',
            exitcode: '',
        }
    },
    mounted () {
      this.encoder = new TextDecoder("utf-8")
    },
    methods: {
        run () {
            this.socket = io('http://172.29.11.80:3000', { reconnection: false })
            this.socket.on('stdout', (output) => {
                this.stdout += this.encoder.decode(output)
            })
            this.socket.on('exited', (code) => {
              console.log("EXITED")
                this.exitcode += code
                this.socket.disconnect()
            })
        },
        postStdin () {
            this.socket.emit('stdin', this.stdin)
        },
        disconnect () {
            // this.socket.off('stdout') // ??
            this.socket.disconnect()
        }
    }
}
</script>