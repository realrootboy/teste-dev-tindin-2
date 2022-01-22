import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public _id?: ObjectId,
    ) {}

    public async checkPassword(password:string):Promise<boolean> {
        console.log({password, pass: this.password});
        return await bcrypt.compare(password, this.password);
    }

    public generateToken():string {
        return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || 'secret');
    }
}