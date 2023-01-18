import { connection, Schema, Model, model } from "mongoose";

export type UserType = {
    name: {
        firstName: string,
        lastName: string
    },
    email: string,
    password: string,
    avatar: string,
    autenticate: boolean
};

const schema = new Schema<UserType>({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    autenticate: { type: Boolean, default: false }
});

const modelName = 'User';
const UserModel = 
    connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<UserType>)
    : model<UserType>(modelName, schema);

export default UserModel;