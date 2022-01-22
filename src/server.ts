import cors from 'cors';
import express from 'express';
import {router} from './routes';


export default class Server {

    app:express.Express;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private routes() {
        this.app.use(router);
    }

}
