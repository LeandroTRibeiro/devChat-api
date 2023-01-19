import { Request, Response } from "express";
import * as userService from "../services/userService";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { UserType } from '../models/User';
import { CloudType, DecodeType } from '../types/types';
import sharp from "sharp";
import { unlink } from 'fs/promises';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.API_KEY as string,
    api_secret: process.env.API_SECRET as string
});

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true })
};

export const teste = async (req: Request, res: Response) => {

    const teste = await User.find({});

    res.json({teste});
}

export const register = async (req: Request, res: Response) => {

    const {firstName, lastName, email, password } = req.body;

    const newUser = await userService.findUser(email);

    if ( !newUser ) {

        if ( firstName && lastName && email && password ) {

            if (req.file) {

                const fileName = `${req.file.filename}.png`;

                const avatar = fileName;

                try {
                    await sharp(req.file.path).toFormat('png').toFile(`./public/media/${fileName}`);
                } catch(error) {
                    console.log('ta dando erro aqui');
                }
        
                await unlink(req.file.path);

                const token = JWT.sign(
                    { email, password },
                    process.env.JWT_SECRET_KEY as string
                );

                try {

                    const cloud: CloudType = await cloudinary.v2.uploader.upload(`https://devchat.onrender.com/media/${fileName}`, {public_id: req.file.filename});

                    const newUser = await userService.createUser(firstName, lastName, email, token, cloud.url);

                    if ( newUser instanceof Error ) {
    
                        res.json({ error: newUser.message });
        
                    } else {
        
                        res.status(201);
                        res.json({ newUser });
        
                    }
                    
                } catch(error) {
                    console.log(error);
                }


            } else {
                res.status(400);
                res.json({ error: 'Arquivo inválido' });
            }

        } else {

            res.json({ error: "Faltam dados" });

        }


    } else {

        res.json({ error: 'Este E-mail já possui cadastro' });

    }

};

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await userService.findUser(email);

    if ( user ) {

        const decode = JWT.verify(user.password, process.env.JWT_SECRET_KEY as string) as DecodeType;

        if ( decode.email === email && decode.password === password ) {

            if(user.autenticate) {
                res.json({ status: true, token: user.password });
            } else {
                res.json({ error: 'Conta inativa' });
            }
            

        } else {

            res.status(401);
            res.json({ error: 'Senha inválida' });

        }

    } else {

        res.status(401);
        res.json({ error: 'Usuário inexistente' });

    }

};

export const uploadfile = async (req: Request, res:Response) => {

    const { user } = req.body;

    if ( req.file ) {

        const fileName = req.file.filename;

        await sharp(req.file.path).toFormat('png').toFile(`./public/media/${fileName}.png`);

        await unlink(req.file.path);

        res.json({ imagem: `${fileName}.png` });

    } else {

        res.status(400);
        res.json({ error: 'Arquivo Inválido' });
    }

};

export const getUser = async (req: Request, res: Response) => {

    const { token } = req.body;

    if(token) {

        const decode = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as DecodeType;

        const user = await userService.findUser(decode.email);

        if(user) {
            res.json({ userName: `${user.name.firstName} ${user.name.lastName}`, avatar: user.avatar });
        } else {
            res.json({ error: 'Usuário não encontrado' });
        }

    } else {
        res.json({ error: 'Faltam dados' });
    }

};
