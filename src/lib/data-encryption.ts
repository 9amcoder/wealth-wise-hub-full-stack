import crypto from 'crypto-js';
import { enc } from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY;

export function encryptTransaction(data:string) {
    const cipher_data = crypto.AES.encrypt(data, SECRET_KEY).toString();
    console.log("cipher_data: " + cipher_data);
    return cipher_data;
}

export function decryptTransaction(data:string) {
    console.log("Received title: " + data);
    const decrypted_data = crypto.AES.decrypt(data.toString(), SECRET_KEY);
    return crypto.enc.Utf8.stringify(decrypted_data);
}
