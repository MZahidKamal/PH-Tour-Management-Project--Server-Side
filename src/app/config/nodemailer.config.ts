/* eslint-disable @typescript-eslint/no-explicit-any */
import * as nodemailer from 'nodemailer';
import envConfig from "./envConfig";
import {consolePrint} from "../utils/consolePrintFunction";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import path from "node:path";
import ejs from "ejs";



const nodemailerTransporter = nodemailer.createTransport({
    host: envConfig.nodemailer_smtp_host as string,
    port: Number(envConfig.nodemailer_smtp_port),
    secure: envConfig.nodemailer_smtp_port === "465",       // True for 465, false for other ports
    auth: {
        user: envConfig.gmail_address,
        pass: envConfig.gmail_app_password
    }
});



interface EmailPayloadInterface {
    targetEmail: string;
    emailSubject: string;
    emailTemplateName?: string;
    emailTemplateData?: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }[];
}



const sendAnEmailToTheUser = async (payload: EmailPayloadInterface) => {
    try {
        const templatePath = path.join(__dirname, `../htmlTemplates/${payload.emailTemplateName}`);
        const templateData = payload.emailTemplateData || {};

        const constructedHTMLContent = await  ejs.renderFile(templatePath, templateData)

        const info = await nodemailerTransporter.sendMail({
            from: envConfig.gmail_address,
            to: payload.targetEmail,
            subject: payload.emailSubject,
            html: constructedHTMLContent,
            attachments: payload.attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType || 'text/html'
            })) || []
        });

        if (info?.messageId){
            consolePrint('Email sent successfully to: ', payload.targetEmail, 'Subject: ', payload.emailSubject);
            return info;
        }
    }
    catch (error) {
        consolePrint('Failed to send email to:', payload.targetEmail, 'Error:', error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to send email to ${payload.targetEmail}. Please try again later.`);
    }
}



export default sendAnEmailToTheUser;



/*
Use this function to send an email to the user:

await sendAnEmailToTheUser({
    targetEmail: 'kamal.md.zahid@gmail.com',
    emailSubject: "Welcome to PH Tour Management Project",
    emailTemplateName: 'forgetPasswordEmail.template.ejs',
    emailTemplateData: {name: 'Kamal Zahid', resetUILink: 'https://www.google.com/'},
    attachments: []
})
*/
