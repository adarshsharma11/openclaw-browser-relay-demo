const WebSocket = require("ws")

const server = new WebSocket.Server({ port: 3000 })

console.log("Gateway running at ws://localhost:3000")

server.on("connection", ws => {

  console.log("Relay connected")

  const commands = [

    {
      action: "open_url",
      url: "https://google.com"
    },

    {
      action: "type",
      selector: "textarea",
      text: "OpenClaw browser automation"
    },

    {
      action: "click",
      selector: "input[type='submit']"
    },

    {
      action: "scroll",
      amount: 800
    }

  ]

  let delay = 2000

  commands.forEach(cmd => {

    setTimeout(() => {

      ws.send(JSON.stringify(cmd))

    }, delay)

    delay += 4000

  })

})