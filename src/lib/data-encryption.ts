import crypto from 'crypto-js';
import { enc } from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY;


export function encryptTransaction(data:string) {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not set');
    }
    const cipher_data = crypto.AES.encrypt(data, SECRET_KEY).toString();
    return cipher_data;
}

export function decryptTransaction(data:string) {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not set');
    }
    const decrypted_data = crypto.AES.decrypt(data.toString(), SECRET_KEY);
    return crypto.enc.Utf8.stringify(decrypted_data);
}
