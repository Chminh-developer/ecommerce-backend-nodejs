require('dotenv').config();
const app = require('./src/app');
const config = require('./src/configs/config.mongodb')

const server = app.listen( config.app.port, () => { 
    console.log(`WSV eCommerce start with ${config.app.port}`);
});

// process.on('SIGINT', () => {
//     server.close( () => console.log('Exit Server Express'));
// });