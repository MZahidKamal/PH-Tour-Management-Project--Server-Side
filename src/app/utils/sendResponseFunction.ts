import {Response} from "express";



interface MetaInterface {
    total: number
}



interface ResponseDataInterface<T> {
    statusCode: number
    success: boolean
    message: string
    data?: T
    meta?: MetaInterface
}



const sendResponseFunction = <T> (res: Response, data: ResponseDataInterface<T>) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta
    });
}



export default sendResponseFunction;
