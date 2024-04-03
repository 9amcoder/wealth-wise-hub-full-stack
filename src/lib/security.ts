import crypto from 'crypto-js';
import { enc } from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY;

export function encryptTransaction(data:string) {
    const cipher_data = crypto.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

    return cipher_data;
}

export function decryptTransaction(data:string) {
    return crypto.AES.decrypt(data, SECRET_KEY).toString(enc.Utf8);
}
