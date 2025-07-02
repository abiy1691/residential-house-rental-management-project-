import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
    const accesstoken = jwt.sign({ user: user._id, role: user.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '20m' });
    const refreshtoken = jwt.sign({ user: user._id, role: user.role }, process.env.JWT_REFRESH_TOKEN);
    return {
        accesstoken,
        refreshtoken
    }
}

export const refresh = (data, exp) => {
    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN, { expiresIn: exp });
    
    return accessToken;
}