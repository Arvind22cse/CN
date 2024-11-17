const net = require('net');
const dgram = require('dgram');

// Replace '192.168.x.x' with the actual IP address of the server
const SERVER_IP = '192.168.x.x';

// TCP Client
const tcpClient = new net.Socket();
tcpClient.connect(12345, SERVER_IP, () => {
    console.log('Connected to TCP server');
    setInterval(() => {
        tcpClient.write('Hello from TCP client');
    }, 2000);
});

tcpClient.on('data', (data) => {
    console.log('Received from TCP server:', data.toString());
});

tcpClient.on('close', () => {
    console.log('TCP connection closed');
});

// UDP Client
const udpClient = dgram.createSocket('udp4');
setInterval(() => {
    const message = Buffer.from('Hello from UDP client');
    udpClient.send(message, 12346, SERVER_IP, (err) => {
        if (err) console.error(err);
    });
}, 2000);

