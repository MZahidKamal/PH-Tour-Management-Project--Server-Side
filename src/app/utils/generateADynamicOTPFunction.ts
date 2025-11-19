import crypto from "crypto";



export const generateADynamicOTP = (length = 6) => {
    const dynamicOTP = crypto.randomInt(10 ** (length - 1), 10 ** length).toString().padStart(length, '0');
    return dynamicOTP;
}
