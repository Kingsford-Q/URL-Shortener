import client from "./client";

export async function fetchAnalytics(linkId, days = 30) {
  const { data } = await client.get(`/api/analytics/${linkId}`, { params: { days } });
  return data;
}
