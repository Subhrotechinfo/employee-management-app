import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongoDbConfigService} from './config.service';
import configuration from './configuration';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        MongooseModule.forRootAsync({
            imports: [MongoDbConfigModule],
            useFactory: async (mongoDbConfigService: MongoDbConfigService) => ({
                uri: mongoDbConfigService.connectionUri
            }),
            inject: [MongoDbConfigService]
        })
    ],
    providers: [ConfigService, MongoDbConfigService],
    exports: [ConfigService, MongoDbConfigService],
})
export class MongoDbConfigModule {
}
