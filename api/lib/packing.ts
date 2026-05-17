import type { PackingCategory, PackingItem, Trip } from "./types";

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

export async function generatePackingItems(_trip: Trip): Promise<PackingItem[]> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackItems.map((item) => ({ ...item, packed: false, id: randomId() }));
  }

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Сгенерируй JSON-массив вещей для поездки в ${_trip.destination}.
Формат: [{"name":"...","category":"clothes"}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content ?? "[]";
    const parsed = JSON.parse(content) as Array<{ name: string; category: PackingCategory }>;
    return parsed.map((item) => ({
      id: randomId(),
      name: item.name,
      category: item.category,
      packed: false
    }));
  } catch {
    return fallbackItems.map((item) => ({ ...item, packed: false, id: randomId() }));
  }
}

export function weatherHint(destination: string) {
  return `Погода в ${destination}: возьмите легкую куртку и зонт на случай дождя.`;
}
