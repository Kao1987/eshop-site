// backend/websocket.js
const WebSocket = require('ws');

const initWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        const data = JSON.parse(message);
        if(data.type === 'newOrder'){
            wss.clients.forEach((client) => {
                if(client !== ws && client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    return wss;
}