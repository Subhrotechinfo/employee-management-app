import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { MediaInterface } from './interfaces/media.interface';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class FileService {
    constructor(
        @InjectModel('MediaSchema')
        private readonly mediaModel: Model<MediaInterface>,
        @InjectModel('UserSchema')
        private readonly userModel: Model<UserInterface>,
    ) { }

    async create(mediaData: object): Promise<any> {
        const media = new this.mediaModel(mediaData);
        return media.save();
    }
    
    async createUser(userData: object): Promise<any> {
        const media = new this.userModel(userData);
        return media.save();
    }

     /**
    * Create User details.
    */
      async createUsers(userDto: Array<Object>): Promise<UserInterface[]> {
        return this.userModel.insertMany(userDto);
    }

    /**
    * Find single User.
    */
    async findOneEmployee(query: object): Promise<UserInterface> {
        return this.userModel.findOne(query).exec();
    }
    async findManyEmployee(query: object): Promise<UserInterface[]> {
        return this.userModel.find(query,{'Id':true}).exec();
    }

    async findAllEmployees(query: object, skip: number, perPage: number): Promise<UserInterface[]> {
        return this.userModel.find(query).sort({ createdAt: 'asc' }).skip(skip).limit(perPage).exec();
    }
    async count(query: object): Promise<number> {
        return this.userModel.countDocuments(query);
    }

    async updateOne(query, usObj: object): Promise<any> {
        console.log('q-', query);
        return this.userModel.updateOne(query,usObj).exec();
    }
    async updateMany(filter, data: object): Promise<any> {
        return this.userModel.updateMany(filter,data).exec();
    }
    async delete(data: object): Promise<any> {
        return this.userModel.deleteOne(data);
    }
}
