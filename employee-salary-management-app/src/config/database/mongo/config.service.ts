import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MongoDbConfigService {

  constructor(private configService: ConfigService) {}
  get connectionUri() : string {
    //get all variables  
    const dbUser = this.configService.get<string>('mongodb.user');
    const dbPass = this.configService.get<string>('mongodb.pass');
    // const dbPort = Number(this.configService.get<number>('mongodb.port'));
    // const dbHost = this.configService.get<number>('mongodb.host');
    // const dbName = this.configService.get<string>('mongodb.name');
    //set default mongo uri.
    let mongodbUri = "mongodb+srv://"+dbUser+":"+dbPass+"@employeemanagement.obiv22i.mongodb.net/?retryWrites=true&w=majority";
    //check if userName
    if(dbUser && dbPass ){
      mongodbUri = `mongodb+srv://${dbUser}:${dbPass}@employeemanagement.obiv22i.mongodb.net/?retryWrites=true&w=majority`;
    }
    return mongodbUri;
  }
}
