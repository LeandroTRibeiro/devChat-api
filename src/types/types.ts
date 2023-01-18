import { UserType } from "../models/User";

export type DecodeType = {
    email: string,
    password: string
};

export type RecoverType = {
    email: string,
    token: string
};

export type UserTypeFront = {
    userName: string,
    avatar: string,
    statusColor: string
};

export type SendMsgType = {
    input: string,
    user: UserType
};

export type RingColorType = {
    color: string,
    user: UserType
}