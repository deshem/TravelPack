import { Trip, TripInput } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTrips: (telegramUserId: string) =>
    request<Trip[]>(`/api/trips?telegramUserId=${encodeURIComponent(telegramUserId)}`),
  createTrip: (telegramUserId: string, input: TripInput) =>
    request<Trip>("/api/trips", {
      method: "POST",
      body: JSON.stringify({ telegramUserId, ...input })
    }),
  generatePackingList: (tripId: string) =>
    request<Trip>(`/api/trips/${tripId}/generate`, {
      method: "POST"
    }),
  togglePacked: (tripId: string, itemId: string, packed: boolean) =>
    request<Trip>(`/api/trips/${tripId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ packed })
    })
};
