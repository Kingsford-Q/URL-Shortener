import client from "./client";

export async function verifyLinkPassword(shortCode, password) {
  const { data } = await client.post(`/api/redirect/${shortCode}/verify`, { password });
  return data.originalUrl;
}

export async function fetchPublicQrBlob(shortCode, format = "png") {
  const { data } = await client.get(`/api/redirect/${shortCode}/qr`, {
    params: { format },
    responseType: "blob",
  });
  return data;
}
