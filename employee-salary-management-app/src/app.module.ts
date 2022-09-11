import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbConfigModule } from './config/database/mongo/config.module';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [FileModule,MongoDbConfigModule,
    MulterModule.register({
      dest: './files',
  }),
  ],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
