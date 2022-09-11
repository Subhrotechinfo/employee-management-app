import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MediaSchema } from './schemas/media.schemas';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as crypto from "crypto";
import * as mime from "mime-types";
import { UserSchema } from './schemas/user.schemas';

@Module({
    imports:[
        // MulterModule.registerAsync({
        //     useFactory: async () => ({
        //       dest: "./files",
        //       limits: {fileSize:200000}, 
        //       storage: multer.diskStorage({
        //         destination(req, file, cb) {
        //           return cb(null, './files');
        //         },
        //         filename: (req, file, cb) => {
        //           crypto.pseudoRandomBytes(16, function (err, raw) {
        //             return cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        //           });
        //         }
        //       }),
        //       fileFilter: (req, file, callback) => {
        //         // Allowing file type
        //         var allowedExtentions = '.csv';
        //         var regex = new RegExp("\.("+allowedExtentions+")$");
        //         if (!file.originalname.match(regex)) {
        //           return callback(new Error('This file type upload not allowed!'), false);
        //         }
        //         callback(null, true);
        //       }
        //     }),
        //   }),
        MongooseModule.forFeature([
            { name: 'UserSchema', schema: UserSchema },
            { name: 'MediaSchema', schema: MediaSchema },
        ]),
    ],
    controllers:[FileController],
    providers: [FileService],
    exports:[FileService]
})
export class FileModule {}
