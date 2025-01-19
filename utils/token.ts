import { createHmac } from "node:crypto";

export function getToken(id: string): string {
  const hmac = createHmac("sha256", "my_secret");
  hmac.update(JSON.stringify({ id: id }));
  const token = hmac.digest("hex");
  return token;
}
