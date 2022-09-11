import { Document } from 'mongoose';

export interface MediaInterface extends Document {
    id: number;
    name: string;
    url: string;
    path: string;
    filename: string;
    size: string;
    mimetype: string;
    encoding: string;
    base64data: string;
    type: string;
}
