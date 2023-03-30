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
exports.AuthenticteAcount = exports.ConfirmRegister = exports.RecoveringPassword = exports.recoverPassword = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService = __importStar(require("../services/userService"));
dotenv_1.default.config();
const recoverPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (email) {
        const user = yield userService.findUser(email);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, token: process.env.JWT_SECRET_RECOVER }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            let link = `https://devlivechat.netlify.app/recoverpasswordmail?token=${token}`;
            let htmlTxt = `
            <html lang='pt-BR'>
            <head>
                <meta charset='UTF-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>DevChat Recupeção de Senha</title>
            </head>
            <style>
            
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
            
                * {
                    box-sizing: border-box;
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                }
            
                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                    gap: 10px;
                    padding: 30px;
                }
            
                h1 {
                    color: #f000b8;
                }
            
                p {
                    text-align: justify;
                    text-indent: 20px;
                }
            
                .btn {
                    color: #fff;
                    font-weight: 600;
                    margin-inline: auto;
                    text-decoration: none;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    padding-left: 5px;
                    padding-right: 5px;
                    border: 2px solid #f000b8;
                    background: #f000b8;
                    border-radius: 10px;
                    width: 200px;
                    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.295);
                }
            
                .btn:hover {
                    color:#f000b8;
                    background: #fff;
                }
            
                .btn:active {
                    opacity: 50%;
                }
            
                label {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                    width: 100%;
                    font-weight: 600;
                }
            </style>
            <body>
                <h1>DevChat</h1>
                <br>
                <p>Lamentamos pelo ocorrido, mas estamos quase lá, para renovação de sua senha sera necessário clicar no link abaixo para gerarmos uma nova senha, desde já agradecemos sua atenção.</p>
                <br>
                <a href='${link}' target='_blank' class='btn'>Clique Aqui</a>
                <br>
                <label>
                    <span>responsável tecnico:</span>
                    <a href='https://github.com/LeandroTRibeiro' target='_blank'>Leandro Thiago Ribeiro</a>
                </label>
                <label>
                    <span>E-mail para contato:</span>
                    <a href='mailto:leandrothiago_ribeiro@hotmail.com?subject=Suporte DevChat' target='_blank'>leandrothiago_ribeiro@hotmail.com</a>
                </label>
            </body>
            </html>`;
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: 'leandrothiago_ribeiro@hotmail.com',
                subject: 'DevChat Recupeção de Senha',
                html: htmlTxt
            };
            try {
                const emailtxt = yield mail_1.default.send(msg);
                res.json({ send: true });
            }
            catch (error) {
                res.json({ error });
            }
        }
        else {
            res.status(400);
            res.json({ error: 'Usuário inexistente' });
        }
    }
    else {
        res.status(400);
        res.json({ error: 'Faltam dados' });
    }
});
exports.recoverPassword = recoverPassword;
const RecoveringPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    if (token && newPassword) {
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            if (decode.token === process.env.JWT_SECRET_RECOVER && decode.email) {
                const JWTpassword = jsonwebtoken_1.default.sign({ email: decode.email, password: newPassword }, process.env.JWT_SECRET_KEY);
                const userUpdate = yield userService.UpdatePassword(decode.email, JWTpassword);
                if (userUpdate instanceof Error) {
                    res.json({ error: userUpdate.message });
                }
                else {
                    res.status(201);
                    res.json({ userUpdate });
                }
            }
            else {
                res.status(403);
                res.json({ error: 'Dados inválidos' });
            }
        }
        catch (error) {
            res.status(403);
            res.json({ error: error.name });
        }
    }
    else {
        res.status(400);
        res.json({ error: 'Faltam dados' });
    }
});
exports.RecoveringPassword = RecoveringPassword;
const ConfirmRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const validate = /\S+@\S+\.\S+/;
    if (email) {
        const hasUser = yield userService.findUser(email);
        if (validate.test(email) && hasUser) {
            const token = jsonwebtoken_1.default.sign({ email: email, token: process.env.JWT_SECRET_CONFIRM }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            let link = `https://devlivechat.netlify.app/authenticateacount?token=${token}`;
            let htmlTxt = `
            <html lang='pt-BR'>
            <head>
                <meta charset='UTF-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>DevChat Recupeção de Senha</title>
            </head>
            <style>
            
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
            
                * {
                    box-sizing: border-box;
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                }
            
                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                    gap: 10px;
                    padding: 30px;
                }
            
                h1 {
                    color: #f000b8;
                }
            
                p {
                    text-align: justify;
                    text-indent: 20px;
                }
            
                .btn {
                    color: #fff;
                    font-weight: 600;
                    margin-inline: auto;
                    text-decoration: none;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    padding-left: 5px;
                    padding-right: 5px;
                    border: 2px solid #f000b8;
                    background: #f000b8;
                    border-radius: 10px;
                    width: 200px;
                    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.295);
                }
            
                .btn:hover {
                    color:#f000b8;
                    background: #fff;
                }
            
                .btn:active {
                    opacity: 50%;
                }
            
                label {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                    width: 100%;
                    font-weight: 600;
                }
            </style>
            <body>
                <h1>DevChat</h1>
                <br>
                <p>Estamos quase lá, para confirmar sua conta de E-mail basta clicar no link abaixo para finalizar seu cadastro</p>
                <br>
                <a href='${link}' target='_blank' class='btn'>Clique Aqui</a>
                <br>
                <label>
                    <span>responsável técnico:</span>
                    <a href='https://github.com/LeandroTRibeiro' target='_blank'>Leandro Thiago Ribeiro</a>
                </label>
                <label>
                    <span>E-mail para contato:</span>
                    <a href='mailto:leandrothiago_ribeiro@hotmail.com?subject=Suporte DevChat' target='_blank'>leandrothiago_ribeiro@hotmail.com</a>
                </label>
            </body>
            </html>`;
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: 'leandrothiago_ribeiro@hotmail.com',
                subject: 'DevChat Confirmação de E-mail',
                html: htmlTxt
            };
            try {
                const emailtxt = yield mail_1.default.send(msg);
                res.json({ send: true });
            }
            catch (error) {
                console.log(error);
                res.json({ error });
            }
        }
        else {
            res.json({ error: 'Este E-mail não é um E-mail válido' });
        }
    }
    else {
        res.status(400);
        res.json({ error: 'Faltam dados' });
    }
});
exports.ConfirmRegister = ConfirmRegister;
const AuthenticteAcount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (token) {
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const user = yield userService.findUser(decode.email);
            if (decode.token === process.env.JWT_SECRET_CONFIRM && user) {
                const userUpdate = yield userService.UpdateAutenticate(decode.email);
                if (userUpdate instanceof Error) {
                    res.json({ error: userUpdate.message });
                }
                else {
                    res.status(201);
                    res.json({ token: userUpdate.password });
                }
            }
            else {
                res.status(403);
                res.json({ error: 'Token inválido' });
            }
        }
        catch (error) {
            console.log(error);
            res.json({ error: 'A duração de seu token expirou' });
        }
    }
    else {
        res.json({ error: 'Faltam Dados' });
    }
});
exports.AuthenticteAcount = AuthenticteAcount;
