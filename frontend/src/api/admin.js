import client from "./client";

export async function fetchAdminStats() {
  const { data } = await client.get("/api/admin/stats");
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await client.get("/api/admin/users");
  return data.users;
}

export async function toggleUserDisabled(id) {
  const { data } = await client.patch(`/api/admin/users/${id}/disable`);
  return data.user;
}

export async function adminDeleteLink(id) {
  await client.delete(`/api/admin/links/${id}`);
}
