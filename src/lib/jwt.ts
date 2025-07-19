import { JwtPayload, sign, verify } from "jsonwebtoken"

export function generateAccessToken (userId: string) {
     const accessToken = sign(
                {sub: userId}, 
                process.env.JWT_SECRET!,
                { expiresIn: '3d' },
            )
    
    return accessToken
}

export function validateAccessTOoken(token:string){
    try {
        const {sub} = verify(token, process.env.JWT_SECRET!) as JwtPayload
        return sub ?? null
    } catch (error) {
        return null;
    }
}