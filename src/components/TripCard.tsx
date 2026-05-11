import { Trip } from "../types";

interface TripCardProps {
  trip: Trip;
  onOpen: (tripId: string) => void;
}

export function TripCard({ trip, onOpen }: TripCardProps) {
  const packedCount = trip.items.filter((item) => item.packed).length;
  const progress = trip.items.length === 0 ? 0 : Math.round((packedCount / trip.items.length) * 100);

  return (
    <button
      type="button"
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"
      onClick={() => onOpen(trip.id)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{trip.destination}</h3>
        <span className="text-sm text-slate-500">{progress}%</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {trip.startDate} - {trip.endDate} | {trip.peopleCount} чел.
      </p>
      <div className="mt-3 h-2 w-full rounded bg-slate-100">
        <div className="h-2 rounded bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>
    </button>
  );
}
