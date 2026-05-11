export type TripType = "relax" | "business" | "hiking" | "city";

export type PackingCategory =
  | "clothes"
  | "electronics"
  | "documents"
  | "hygiene"
  | "other";

export interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: TripType;
}

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  packed: boolean;
  assignedTo?: string;
}

export interface Trip extends TripInput {
  id: string;
  ownerTelegramId: string;
  members: string[];
  items: PackingItem[];
  createdAt: string;
}
