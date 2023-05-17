import express, {Application} from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression'
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

class App{
    public port: number;
    public express: Application;

    constructor(controllers: Controller[],port: number) {
        this.port = port;
        this.express = express();

        this.initialiseDatabaseConnection();
        this.initialiseControllers(controllers);
        this.initialiseMiddleware();
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(compression());
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller)=>{
            this.express.use('/api',controller.router);
        })
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const {MONGO_USERNAME,MONGO_PASS} = process.env;
        mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASS}@typescript-cluster.avgcvc3.mongodb.net/`,{dbName: 'typescript-api'});
    }

    public listen(): void {
        this.express.listen(this.port,()=>{
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}

export default App;