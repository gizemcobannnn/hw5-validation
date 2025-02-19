import setupServer from './server.js';
import {initMongoConnection} from './db/initMongoConnection.js';

const bootstrap = async()=>{
    initMongoConnection();
    setupServer();
}
bootstrap();

