const WebSocket = require("ws")
const CDP = require("chrome-remote-interface")

let chrome
let Page
let Runtime

async function connectChrome() {

  if (chrome) return

  try {

    chrome = await CDP()

    Page = chrome.Page
    Runtime = chrome.Runtime

    await Page.enable()

    console.log("Connected to Chrome")

  } catch (err) {

    console.error("Failed to connect to Chrome. Make sure Chrome is running with remote debugging.")
    process.exit(1)

  }

}

async function openUrl(url) {

  await Page.navigate({ url })
  await Page.loadEventFired()

  console.log("Opened URL:", url)

}

async function click(selector) {

  await Runtime.evaluate({
    expression: `document.querySelector("${selector}").click()`
  })

  console.log("Clicked:", selector)

  try {
    await Page.loadEventFired()
  } catch {}

}

async function type(selector, text) {

  await Runtime.evaluate({
    expression: `document.querySelector("${selector}").value="${text}"`
  })

  console.log("Typed:", text)

}

async function scroll(amount) {

  await Runtime.evaluate({
    expression: `window.scrollBy({top:${amount},behavior:'smooth'})`
  })

  console.log("Scrolled:", amount)

}

async function runCommand(cmd) {

  switch (cmd.action) {

    case "open_url":
      await openUrl(cmd.url)
      break

    case "click":
      await click(cmd.selector)
      break

    case "type":
      await type(cmd.selector, cmd.text)
      break

    case "scroll":
      await scroll(cmd.amount)
      break

    default:
      console.log("Unknown command:", cmd)

  }

}

async function startRelay() {

  await connectChrome()

  const ws = new WebSocket("ws://localhost:3000")

  ws.on("open", () => {
    console.log("Relay connected to gateway")
  })

  ws.on("message", async msg => {

    try {

      const command = JSON.parse(msg)

      console.log("Command received:", command)

      await runCommand(command)

    } catch (err) {

      console.error("Command failed:", err)

    }

  })

  ws.on("error", err => {

    console.error("Relay connection error:", err.message)

  })

}

startRelay()