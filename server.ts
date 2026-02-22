import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bare = createBareServer('/bare/');
const app = express();
const server = createServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Ultraviolet scripts
const uvPath = path.join(__dirname, 'node_modules/@titaniumnetwork-dev/ultraviolet/dist');
app.use('/uv/', express.static(uvPath));

// Serve SW and handler at root for easier scoping
app.get('/uv.sw.js', (req, res) => res.sendFile(path.join(uvPath, 'uv.sw.js')));
app.get('/uv.handler.js', (req, res) => res.sendFile(path.join(uvPath, 'uv.handler.js')));
app.get('/uv.bundle.js', (req, res) => res.sendFile(path.join(uvPath, 'uv.bundle.js')));

app.use(express.static(path.join(__dirname, 'public')));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

async function start() {
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.join(__dirname, 'dist')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
    }

    const PORT = 3000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
}

start();
