"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccess = void 0;
const Mongoose = require("mongoose");
class DataAccess {
    constructor() {
        DataAccess.connect();
    }
    static connect() {
        if (this.mongooseInstance)
            return this.mongooseInstance;
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.on("open", () => {
            console.log("Connected to mongodb.");
        });
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING);
        return this.mongooseInstance;
    }
}
exports.DataAccess = DataAccess;
//static DB_CONNECTION_STRING:string = 'mongodb://dbAdmin:test@localhost:27017/gogetter?authSource=admin';
DataAccess.DB_CONNECTION_STRING = 'mongodb+srv://Cluster0:Cluster0GoGetter@cluster0.hfpeten.mongodb.net/gogetter';
DataAccess.connect();
console.log(DataAccess.mongooseConnection.readyState);
