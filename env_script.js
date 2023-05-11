const os = require('os');
const fs = require('fs');

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
const FRONTEND_URL = `http://localhost:3000`;
const REACT_APP_IP_BACKEND = 'localhost';
const CALLBACKURL = `http://localhost:6969/authentication/intra`;

// Constant environment variables
const env = {
    DB_PORT: 5432,
    POSTGRES_USER: 'postgres',
    POSTGRES_DB: 'nest',
	POSTGRES_PASSWORD: '123',
    JWT_SECRET_KEY: 'qwerty',
    '2F_APP_NAME': 'LAB',
    CLIENTID: 'u-s4t2ud-f3a8f422e35ef818916876017f78b1efa39cd30f33eb5c1aa1b610757499310d',
    CLIENTSECRET: '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',
    REACT_APP_INTRA_SIGNIN_LINK: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f3a8f422e35ef818916876017f78b1efa39cd30f33eb5c1aa1b610757499310d&redirect_uri=http%3A%2F%2Flocalhost%3A6969%2Fauthentication%2Fintra&response_type=code',

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

fs.writeFileSync('./backend/.env', content);
fs.writeFileSync('./frontend/.env', content);

console.log('Do not forget to change CALLBACK URL on intra!');
