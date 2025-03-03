// express sunucusunun çalışma mantığını içerecek.
//setupServer adında bir fonksiyon oluşturun; bu fonksiyon express sunucusunu oluşturacak.
//  Bu fonksiyon şunları içermelidir:
//express() çağrısıyla sunucunun oluşturulması
//cors ve pino logger'ının ayarlanması
//Mevcut olmayan rotalar için 404 hata durumu ve uygun mesaj döndürülmesi.{message: 'Not found'}
// Sunucunun, PORT ortam değişkeni aracılığıyla belirtilen veya belirtilmemişse 3000 numaralı portta başlatılması

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import contactRouters from './routers/contacts.js';
import authRouters from './routers/auth.js'
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const setupServer = ()=>{
    const server = express();
    const PORT= Number(process.env.PORT || 4000 );

    const logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true, // Renkli çıktı
          translateTime: true, // Tarih ve saat bilgisi ekleme
        },
      },
    });
  
    // Middleware'ler
    server.use(pinoHttp({ logger }));
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());

    server.use('/uploads', express.static(UPLOAD_DIR));

    server.use('/',authRouters);
    server.use('/',contactRouters);
    server.use(errorHandler);
    server.use(notFoundHandler);

server.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`);
});
}

export default setupServer;


