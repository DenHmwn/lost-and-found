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
// Verifikasi token (menggunakan jose)
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error("Verifikasi Token Gagal: ", error);
    return null;
  }
}
