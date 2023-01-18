"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
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
const UserModel = mongoose_1.connection && mongoose_1.connection.models[modelName]
    ? mongoose_1.connection.models[modelName]
    : (0, mongoose_1.model)(modelName, schema);
exports.default = UserModel;
