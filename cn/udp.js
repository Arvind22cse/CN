// udp_server.js
const dgram = require('dgram');
const PORT = 8080;
const server = dgram.createSocket('udp4');

let clients = [];

server.on('message', (msg, rinfo) => {
    const message = msg.toString();
    console.log(`Received message from ${rinfo.address}:${rinfo.port} - ${message}`);

    // Check if client is already registered
    const client = clients.find(client => client.address === rinfo.address && client.port === rinfo.port);
    if (!client) {
        // Add new client to the list
        clients.push({ address: rinfo.address, port: rinfo.port });
    }

    // Broadcast message to all clients except the sender
    clients.forEach(client => {
        if (client.address !== rinfo.address || client.port !== rinfo.port) {
            server.send(message, client.port, client.address, (err) => {
                if (err) console.error(`Error sending message to ${client.address}:${client.port}`, err);
            });
        }
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(PORT);
