import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { TripInput, TripType } from "../types";
import { useAppStore } from "../store/appStore";

interface CreateTripScreenProps {
  onCreated: (tripId: string) => void;
}

const initialForm: TripInput = {
  destination: "",
  startDate: "",
  endDate: "",
  peopleCount: 1,
  tripType: "relax"
};

export function CreateTripScreen({ onCreated }: CreateTripScreenProps) {
  const [form, setForm] = useState<TripInput>(initialForm);
  const telegramUserId = useAppStore((state) => state.telegramUserId);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!telegramUserId) {
        throw new Error("Telegram user id missing");
      }
      return api.createTrip(telegramUserId, form);
    },
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ["trips", telegramUserId] });
      onCreated(trip.id);
    }
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold text-slate-900">Новая поездка</h2>

      <input
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        placeholder="Куда едем?"
        value={form.destination}
        onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="date"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.startDate}
          onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
        />
        <input
          required
          type="date"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.endDate}
          onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min={1}
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.peopleCount}
          onChange={(e) => setForm((prev) => ({ ...prev, peopleCount: Number(e.target.value) || 1 }))}
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.tripType}
          onChange={(e) => setForm((prev) => ({ ...prev, tripType: e.target.value as TripType }))}
        >
          <option value="relax">Отдых</option>
          <option value="business">Бизнес</option>
          <option value="hiking">Поход</option>
          <option value="city">Город</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white disabled:opacity-70"
      >
        {createMutation.isPending ? "Создаем..." : "Создать и открыть"}
      </button>
      {createMutation.isError && <p className="text-sm text-red-600">Ошибка при создании поездки.</p>}
    </form>
  );
}
