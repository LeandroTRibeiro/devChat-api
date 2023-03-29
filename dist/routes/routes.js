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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const apiController = __importStar(require("../controllers/apiController"));
const emailController = __importStar(require("../controllers/emailController"));
const upload = (0, multer_1.default)({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fileSize: 33130188 },
});
const router = (0, express_1.Router)();
router.get('/ping', apiController.ping);
router.post('/register', upload.single('avatar'), apiController.register);
router.post('/login', apiController.login);
router.post('/recover', emailController.recoverPassword);
router.post('/updatepassword', emailController.RecoveringPassword);
router.post('/confirm', emailController.ConfirmRegister);
router.post('/authenticateacount', emailController.AuthenticteAcount);
router.post('/getuser', apiController.getUser);
exports.default = router;
