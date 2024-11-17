// udp_client.js
const dgram = require('dgram');
const readline = require('readline');
const client = dgram.createSocket('udp4');

const SERVER_PORT = 8080;
const SERVER_HOST = 'localhost';
const CLIENT_PORT = Math.floor(Math.random() * (65535 - 1024) + 1024); // Assign a random port for each client

// Set up readline interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

// Listen for incoming messages from the server
client.on('message', (msg) => {
    console.clear();
    console.log("Collaborative Editor Content (Updated):");
    console.log(msg.toString());
    rl.prompt();
});

client.on('listening', () => {
    console.log(`Client listening on port ${CLIENT_PORT}`);
    rl.prompt();
});

client.bind(CLIENT_PORT); // Bind the client to a random port to listen for server broadcasts

rl.on('line', (input) => {
    // Send user input to the server
    client.send(input, SERVER_PORT, SERVER_HOST, (err) => {
        if (err) console.error('Error sending message:', err);
    });
});
