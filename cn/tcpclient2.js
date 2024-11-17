// client.js
const WebSocket = require('ws');
const readline = require('readline');

const PORT = 8080;
const ws = new WebSocket(`ws://localhost:${PORT}`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

ws.on('open', () => {
    console.log("Connected to the server");
    rl.prompt();
});

ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    // Handle incoming messages based on their type
    if (parsedMessage.type === 'update') {
        console.clear();
        console.log("Collaborative Editor Content (Updated):");
        console.log(parsedMessage.data);
        rl.prompt();
    } else if (parsedMessage.type === 'history') {
        console.log("Editor Content History:");
        console.log(parsedMessage.data);
        rl.prompt();
    }
});

rl.on('line', (input) => {
    const data = {
        type: 'update',
        data: input
    };

    // Send the input to the server
    ws.send(JSON.stringify(data));
    rl.prompt();
});

ws.on('close', () => {
    console.log("Disconnected from the server");
    rl.close();
});
