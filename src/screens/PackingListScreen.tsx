import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAppStore } from "../store/appStore";

interface PackingListScreenProps {
  tripId: string;
}

export function PackingListScreen({ tripId }: PackingListScreenProps) {
  const queryClient = useQueryClient();
  const trip = useAppStore((state) => state.trips.find((item) => item.id === tripId));
  const telegramUserId = useAppStore((state) => state.telegramUserId);

  const generateMutation = useMutation({
    mutationFn: () => api.generatePackingList(tripId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", telegramUserId] })
  });

  const toggleMutation = useMutation({
    mutationFn: ({ itemId, packed }: { itemId: string; packed: boolean }) => api.togglePacked(tripId, itemId, packed),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", telegramUserId] })
  });

  const progress = useMemo(() => {
    if (!trip || trip.items.length === 0) {
      return 0;
    }
    const packedCount = trip.items.filter((item) => item.packed).length;
    return Math.round((packedCount / trip.items.length) * 100);
  }, [trip]);

  if (!trip) {
    return <p className="text-sm text-slate-600">Поездка не найдена.</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{trip.destination}</h2>
        <button
          className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white"
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? "Генерация..." : "AI список"}
        </button>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
          <span>Прогресс</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded bg-slate-100">
          <div className="h-2 rounded bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="space-y-2">
        {trip.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <input
              type="checkbox"
              checked={item.packed}
              onChange={(e) => toggleMutation.mutate({ itemId: item.id, packed: e.target.checked })}
            />
            <div>
              <p className={`font-medium ${item.packed ? "text-slate-400 line-through" : "text-slate-900"}`}>{item.name}</p>
              <p className="text-xs text-slate-500">{item.category}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
