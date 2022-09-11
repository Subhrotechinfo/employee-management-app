import { Document } from 'mongoose';

export interface UserInterface extends Document {
    Id: number;
    login:string;
    name:string;
    salary:number;
}
