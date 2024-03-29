"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getUser = exports.login = exports.register = exports.ping = void 0;
const userService = __importStar(require("../services/userService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const ping = (req, res) => {
    res.json({ pong: true });
};
exports.ping = ping;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    const newUser = yield userService.findUser(email);
    if (!newUser) {
        if (firstName && lastName && email && password) {
            if (req.file) {
                const fileName = `${req.file.filename}.png`;
                const avatar = fileName;
                try {
                    yield (0, sharp_1.default)(req.file.path).resize(200).toFormat('png').toFile(`./public/${fileName}`);
                }
                catch (error) {
                    console.log(error);
                }
                const token = jsonwebtoken_1.default.sign({ email, password }, process.env.JWT_SECRET_KEY);
                try {
                    const cloud = yield cloudinary_1.default.v2.uploader.upload(`./public/${fileName}`, { public_id: req.file.filename });
                    yield (0, promises_1.unlink)(req.file.path);
                    yield (0, promises_1.unlink)(`./public/${fileName}`);
                    const newUser = yield userService.createUser(firstName, lastName, email, token, cloud.url);
                    if (newUser instanceof Error) {
                        res.json({ error: newUser.message });
                    }
                    else {
                        res.status(201);
                        res.json({ newUser });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                res.status(400);
                res.json({ error: 'Arquivo inválido' });
            }
        }
        else {
            res.json({ error: "Faltam dados" });
        }
    }
    else {
        res.json({ error: 'Este E-mail já possui cadastro' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userService.findUser(email);
    if (user) {
        const decode = jsonwebtoken_1.default.verify(user.password, process.env.JWT_SECRET_KEY);
        if (decode.email === email && decode.password === password) {
            if (user.autenticate) {
                res.json({ status: true, token: user.password });
            }
            else {
                res.json({ error: 'Conta inativa' });
            }
        }
        else {
            res.status(401);
            res.json({ error: 'Senha inválida' });
        }
    }
    else {
        res.status(401);
        res.json({ error: 'Usuário inexistente' });
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (token) {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = yield userService.findUser(decode.email);
        if (user) {
            res.json({ userName: `${user.name.firstName} ${user.name.lastName}`, avatar: user.avatar });
        }
        else {
            res.json({ error: 'Usuário não encontrado' });
        }
    }
    else {
        res.json({ error: 'Faltam dados' });
    }
});
exports.getUser = getUser;
