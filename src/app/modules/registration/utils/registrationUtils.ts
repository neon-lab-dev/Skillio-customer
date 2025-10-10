import jwt, { SignOptions } from 'jsonwebtoken';

export const createToken = (jwtPayload : {profileId:string , nickName: string , mobileNumber:string | undefined }, secret:string, expiresIn:string) => {
    const token = jwt.sign(jwtPayload, secret , {expiresIn} as SignOptions);

    return token;
};