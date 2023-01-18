"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAutenticate = exports.UpdatePassword = exports.findUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUser = (firstName, lastName, email, token, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        const newUser = new User_1.default;
        newUser.name.firstName = firstName;
        newUser.name.lastName = lastName;
        newUser.email = email;
        newUser.password = token;
        newUser.avatar = avatar;
        yield newUser.save();
        return newUser;
    }
    else {
        return new Error('Sem o token de validação!');
    }
});
exports.createUser = createUser;
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findOne({ email: email });
});
exports.findUser = findUser;
const UpdatePassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUser)(email);
    if (user) {
        user.password = newPassword;
        yield user.save();
        return user;
    }
    else {
        return new Error('Usuário inexistente');
    }
});
exports.UpdatePassword = UpdatePassword;
const UpdateAutenticate = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUser)(email);
    if (user) {
        user.autenticate = true;
        yield user.save();
        return user;
    }
    else {
        return new Error('Usuário inexistente');
    }
});
exports.UpdateAutenticate = UpdateAutenticate;
