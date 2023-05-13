const os = require('os');
const fs = require('fs');
const readline = require('readline');

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

let MY_IP = getLocalIP();

// Prepare readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Do you want to use 'Pongus Schlongus'? (y/n) ", function(answer) {
    let CLIENTID, CLIENTSECRET, REACT_APP_INTRA_SIGNIN_LINK;

    if (answer.toLowerCase() === 'y') {
        MY_IP = 'localhost';
        CLIENTID = 'u-s4t2ud-f3a8f422e35ef818916876017f78b1efa39cd30f33eb5c1aa1b610757499310d';
        CLIENTSECRET = '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';
        REACT_APP_INTRA_SIGNIN_LINK = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f3a8f422e35ef818916876017f78b1efa39cd30f33eb5c1aa1b610757499310d&redirect_uri=http%3A%2F%2Flocalhost%3A6969%2Fauthentication%2Fintra&response_type=code';
    } else {
        CLIENTID = 'u-s4t2ud-13c0b288c085cc7ea7e00c35299630ea691a16f62e69df962c35df1e235d3664';
        CLIENTSECRET = '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';
		REACT_APP_INTRA_SIGNIN_LINK = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENTID}&redirect_uri=http%3A%2F%2F${MY_IP}%3A6969%2Fauthentication%2Fintra&response_type=code`;
    }

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
        CLIENTID,
        CLIENTSECRET,
        REACT_APP_INTRA_SIGNIN_LINK,

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

    rl.close();
});

