import { Request, Response } from 'express';

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

import * as userService from '../services/userService';

import { RecoverType } from '../types/types';

dotenv.config();

export const recoverPassword = async (req: Request, res: Response) => {

    const { email } = req.body;

    if ( email ) {

        const user = await userService.findUser(email);

        if ( user ) {

            const token = JWT.sign(
                { email: user.email ,token: process.env.JWT_SECRET_RECOVER as string },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '1h' }
            );

            let link: string = `https://devlivechat.netlify.app/recoverpasswordmail?token=${token}`;

            let htmlTxt: string = `
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

            sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

            const msg = {
                to: email,
                from: 'leandrothiago_ribeiro@hotmail.com',
                subject: 'DevChat Recupeção de Senha',
                html: htmlTxt
            }

            try {
                const emailtxt = await sgMail.send(msg);
                res.json({ send: true });
            } catch(error) {
                res.json({error});
            }

        } else {

            res.status(400);
            res.json({ error: 'Usuário inexistente' });

        }

    } else {

        res.status(400);
        res.json({ error: 'Faltam dados' });

    }

};

export const RecoveringPassword = async (req: Request, res: Response) => {
    
    const { token, newPassword } = req.body;

    if ( token && newPassword ) {

        try {

            const decode = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as RecoverType;

            if (decode.token === process.env.JWT_SECRET_RECOVER as string && decode.email) {

                const JWTpassword = JWT.sign(
                    {email: decode.email, password: newPassword},
                    process.env.JWT_SECRET_KEY as string
                );

                const userUpdate = await userService.UpdatePassword(decode.email, JWTpassword);

                if ( userUpdate instanceof Error ) {
                
                    res.json({ error: userUpdate.message });
    
                } else {
                    res.status(201);
                    res.json({ userUpdate });
                }

            } else {

                res.status(403);
                res.json({ error: 'Dados inválidos' });
            }

        } catch(error: any) {

            res.status(403);
            res.json({ error: error.name });
        }

    } else {

        res.status(400);
        res.json({ error: 'Faltam dados' });

    }

};

export const ConfirmRegister = async (req: Request, res: Response) => {

    const { email } = req.body;

    const validate = /\S+@\S+\.\S+/;

    if (email) {

        const hasUser = await userService.findUser(email);

        if(validate.test(email) && hasUser) {

            const token = JWT.sign(
                { email: email ,token: process.env.JWT_SECRET_CONFIRM as string },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '1h' }
            );

            let link: string = `https://devlivechat.netlify.app/authenticateacount?token=${token}`;

            let htmlTxt: string = `
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

            sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

            const msg = {
                to: email,
                from: 'leandrothiago_ribeiro@hotmail.com',
                subject: 'DevChat Confirmação de E-mail',
                html: htmlTxt
            };

            try {

                const emailtxt = await sgMail.send(msg);
                res.json({ send: true });

            } catch(error) {

                console.log(error);
                
                res.json({error});
            }


        } else {

            res.json({ error: 'Este E-mail não é um E-mail válido' });
        }

    } else {

        res.status(400);
        res.json({ error: 'Faltam dados' });

    }
};

export const AuthenticteAcount = async (req: Request, res: Response) => {

    const { token } = req.body;

    if(token) {

        try {

            const decode = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as RecoverType;

            const user = await userService.findUser(decode.email);

            if(decode.token === process.env.JWT_SECRET_CONFIRM as string && user) {
    
                const userUpdate = await userService.UpdateAutenticate(decode.email);
    
                if ( userUpdate instanceof Error ) {
                    
                    res.json({ error: userUpdate.message });
    
                } else {
                    res.status(201);
                    res.json({ token: userUpdate.password });
                }
    
            } else {
                res.status(403);
                res.json({ error: 'Token inválido' });
            }

        } catch(error) {
            console.log(error);
            res.json({ error: 'A duração de seu token expirou' });
        }
        

    } else {
        res.json({error: 'Faltam Dados'})
    }

};

