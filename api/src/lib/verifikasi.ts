import { jwtVerify } from "jose";
import { TokenPayload } from "./interface";
import { SECRET } from "./secret";

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
