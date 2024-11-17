const WebSocket = require('ws');
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });
let clients = [];
let editorContent = ''; // Store the current state of the editor content

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New client connected');

    // Send the editor content history to the new client
    ws.send(JSON.stringify({
        type: 'history',
        data: editorContent
    }));

    // Handle messages sent by clients
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);  // Parse incoming message as JSON
            if (parsedMessage.type === 'update') {
                editorContent = parsedMessage.data;

                // Broadcast the updated editor content to all clients
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'update',
                            data: editorContent
                        }));
                    }
                });
            }
        } catch (err) {
            console.log('Error parsing message:', err);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

