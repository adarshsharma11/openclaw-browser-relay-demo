# OpenClaw Browser Relay Test

This project simulates a simplified OpenClaw browser automation pipeline.

Architecture:

Agent → Gateway → Browser Relay → Chrome DevTools → Chrome Browser

The goal is to validate that agents can reliably control a Chrome browser.

Supported actions:

- open_url
- click
- type
- scroll

---

## Requirements

Node.js 18+
Yarn
Google Chrome

---

## Install

Clone the project and install dependencies.

yarn install

---

## Start Chrome with Debugging

Close all Chrome windows first.

Mac:

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
--remote-debugging-port=9222 \
--user-data-dir=/tmp/openclaw

Windows:

chrome.exe --remote-debugging-port=9222

Verify Chrome debug interface:

http://localhost:9222/json

---

## Run Gateway

Start the command gateway.

yarn gateway

Output:

Gateway running at ws://localhost:3000

---

## Run Browser Relay

In another terminal:

yarn relay

Output:

Connected to Chrome  
Relay connected to gateway

---

## End-to-End Test

The gateway will send the following commands:

1. open URL (Google)
2. type search text
3. click search button
4. scroll results page

Expected browser behaviour:

Chrome opens Google  
Search text is typed automatically  
Search is submitted  
Results page scrolls

---

## Example Commands

open_url

{
 "action": "open_url",
 "url": "https://example.com"
}

click

{
 "action": "click",
 "selector": "#login"
}

type

{
 "action": "type",
 "selector": "#email",
 "text": "test@example.com"
}

scroll

{
 "action": "scroll",
 "amount": 600
}

---

## Debugging

If Chrome connection fails:

Ensure Chrome is running with

--remote-debugging-port=9222

Check:

http://localhost:9222/json

If relay cannot connect to gateway:

Ensure gateway is running on port 3000.

---

## Purpose

This project validates that a browser relay can:

- attach to a Chrome session
- receive commands from agents
- execute browser automation reliably

It can be used to debug OpenClaw Browser Relay and Chrome extension integration.