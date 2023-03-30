import mongoose, { connect } from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);

export const mongoConnect = async () => {
    try {
        await connect(process.env.MONGO_URL as string);
        console.log('Conectado ao database');
        
    } catch(error) {
        console.log('Ocorreu um erro', error);
    }
};