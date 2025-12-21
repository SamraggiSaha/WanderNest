class ExpressError extends Error {
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.messsage = message;
    }
}
module.exports = ExpressError;