import { getTokenFromCookies } from "./getTokenCookies";
import { verifyToken } from "./verifikasi";

export async function getAuth() {
  const token = await getTokenFromCookies();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return payload;
}
