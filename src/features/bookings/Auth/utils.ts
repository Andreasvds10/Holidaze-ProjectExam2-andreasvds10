// src/features/bookings/Auth/utils.ts

export function getNameFromToken(): string {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const base64Payload = token.split(".")[1];
    const json = atob(base64Payload);
    const payload = JSON.parse(json);

    if (!payload.name) {
      throw new Error("Token does not contain name");
    }

    return payload.name as string;
  } catch (error) {
    console.error("[utils] Failed to decode JWT:", error);
    throw new Error("Invalid token");
  }
}
