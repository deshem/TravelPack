import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAppStore } from "../store/appStore";
import { TripCard } from "../components/TripCard";

interface HomeScreenProps {
  onCreate: () => void;
  onOpenTrip: (tripId: string) => void;
}

export function HomeScreen({ onCreate, onOpenTrip }: HomeScreenProps) {
  const { telegramUserId, setTrips } = useAppStore();

  const tripsQuery = useQuery({
    queryKey: ["trips", telegramUserId],
    queryFn: async () => {
      if (!telegramUserId) {
        return [];
      }
      const trips = await api.getTrips(telegramUserId);
      setTrips(trips);
      return trips;
    },
    enabled: Boolean(telegramUserId)
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Мои поездки</h2>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white" onClick={onCreate}>
          Создать поездку
        </button>
      </div>

      {tripsQuery.isLoading && <p className="text-sm text-slate-500">Загрузка...</p>}
      {tripsQuery.isError && <p className="text-sm text-red-600">Не удалось загрузить поездки.</p>}

      <div className="space-y-3">
        {(tripsQuery.data ?? []).map((trip) => (
          <TripCard key={trip.id} trip={trip} onOpen={onOpenTrip} />
        ))}
      </div>
    </section>
  );
}
