import client, { getApiBaseUrl } from "./client";

export function buildShortUrl(shortCode) {
  return `${getApiBaseUrl()}/${shortCode}`;
}

export async function createLink(input) {
  const { data } = await client.post("/api/links", input);
  return data;
}

export async function listLinks(params) {
  const { data } = await client.get("/api/links", { params });
  return data;
}

export async function getLink(id) {
  const { data } = await client.get(`/api/links/${id}`);
  return data;
}

export async function updateLink(id, input) {
  const { data } = await client.put(`/api/links/${id}`, input);
  return data.link;
}

export async function deleteLink(id) {
  await client.delete(`/api/links/${id}`);
}

export async function toggleLink(id) {
  const { data } = await client.patch(`/api/links/${id}/toggle`);
  return data.link;
}

export async function fetchQrBlob(id, format = "png") {
  const { data } = await client.get(`/api/links/${id}/qr`, {
    params: { format },
    responseType: "blob",
  });
  return data;
}
