import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

const generateToken = ({ email}: TokenPayload): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'project_app'};

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.sign({ email }, process.env.JWT_SECRET, options);
    } catch (error) {
        console.log(error);
        throw new Error('error generating token');
    }
}

export {generateToken}