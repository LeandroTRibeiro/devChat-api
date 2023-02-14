import { Router } from "express";
import multer from "multer";
import * as apiController from '../controllers/apiController';
import * as emailController from '../controllers/emailController';

const upload = multer({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

        cb(null, allowed.includes( file.mimetype ));
    },
    limits: { fileSize: 10485760 },

});

const router = Router();

router.get('/ping', apiController.ping);

router.post('/register',upload.single('avatar'), apiController.register);
router.post('/login', apiController.login);

router.post('/recover', emailController.recoverPassword);
router.post('/updatepassword', emailController.RecoveringPassword);
router.post('/confirm', emailController.ConfirmRegister);
router.post('/authenticateacount', emailController.AuthenticteAcount);

router.post('/getuser', apiController.getUser);




export default router;