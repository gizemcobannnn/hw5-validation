import setupServer from './server.js';
import {initMongoConnection} from './db/initMongoConnection.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { cloudPhoto } from './utils/cloudnary.js';

const bootstrap = async()=>{
    initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await cloudPhoto();
    setupServer();
}
bootstrap();

