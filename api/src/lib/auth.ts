import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface TokenPayload {
  id: string;
  name: string;
  role: string;
}

export async function AccessToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1m")
    .sign(SECRET);
}

export async function RefreshToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(SECRET);
}