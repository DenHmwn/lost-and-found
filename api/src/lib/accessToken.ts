import { SignJWT } from "jose";
import { TokenPayload } from "./tokenPayload";
import { SECRET } from "./secret";

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