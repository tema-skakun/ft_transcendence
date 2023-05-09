const os = require('os');
const fs = require('fs');
const path = require('path');

// Function to get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const MY_IP = getLocalIP();

// Construct dependent environment variables
const DB_HOST = MY_IP;
const FRONTEND_URL = `http://${MY_IP}:3000`;
const REACT_APP_IP_BACKEND = MY_IP;
const CALLBACKURL = `http://${MY_IP}:6969/authentication/intra`;

// Constant environment variables
const env = {
    DB_PORT: 5432,
    POSTGRES_USER: 'postgres',
    POSTGRES_DB: 'nest',
	POSTGRES_PASSWORD: '123',
    JWT_SECRET_KEY: 'qwerty',
    '2F_APP_NAME': 'LAB',
    CLIENTID: 'u-s4t2ud-13c0b288c085cc7ea7e00c35299630ea691a16f62e69df962c35df1e235d3664',
    CLIENTSECRET: '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',

    // Include dependent variables
    DB_HOST,
    FRONTEND_URL,
	REACT_APP_IP_BACKEND,
    CALLBACKURL
};

// Write to .env file
const content = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

if (fs.existsSync(backendDir)) {
	fs.writeFileSync(path.join(backendDir, '.env'), content);
}
if (fs.existsSync(frontendDir)) {
	fs.writeFileSync(path.join(frontendDir, '.env'), content);
}
if (!fs.existsSync(backendDir) && !fs.existsSync(frontendDir)) {
	fs.writeFileSync(path.join(__dirname, '.env'), content);
}

console.log('Do not forget to change CALLBACK URL on intra!');
