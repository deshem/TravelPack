import OpenAI from "openai";
import { PackingCategory, PackingItem, Trip } from "../types";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const fallbackItems: Array<{ name: string; category: PackingCategory }> = [
  { name: "Паспорт", category: "documents" },
  { name: "Билеты", category: "documents" },
  { name: "Зарядка для телефона", category: "electronics" },
  { name: "Футболка", category: "clothes" },
  { name: "Зубная щетка", category: "hygiene" }
];

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function generatePackingItems(trip: Trip): Promise<PackingItem[]> {
  const openai = getOpenAIClient();
  if (!openai) {
    return fallbackItems.map((item) => ({ ...item, packed: false, id: randomId() }));
  }

  const prompt = `Сгенерируй JSON-массив вещей для поездки.
Destination: ${trip.destination}
Dates: ${trip.startDate} - ${trip.endDate}
Trip type: ${trip.tripType}
People count: ${trip.peopleCount}
Категории: clothes, electronics, documents, hygiene, other.
Формат ответа: [{"name":"...","category":"clothes"}]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  const content = completion.choices[0]?.message?.content ?? "[]";
  let parsed: Array<{ name: string; category: PackingCategory }> = [];

  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = fallbackItems;
  }

  return parsed.map((item) => ({
    id: randomId(),
    name: item.name,
    category: item.category,
    packed: false
  }));
}
