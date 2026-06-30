import client from "./client";

export async function verifyLinkPassword(shortCode, password) {
  const { data } = await client.post(`/api/redirect/${shortCode}/verify`, { password });
  return data.originalUrl;
}
