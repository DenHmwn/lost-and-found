import { SignJWT } from "jose";
import { TokenPayload } from "./interface";
import { SECRET } from "./secret";

export async function AccessToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("20m")
    .sign(SECRET);
}
