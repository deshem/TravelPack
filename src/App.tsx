import { useEffect, useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { CreateTripScreen } from "./screens/CreateTripScreen";
import { PackingListScreen } from "./screens/PackingListScreen";
import { useAppStore } from "./store/appStore";

type View = "home" | "create" | "list";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: { user?: { id?: number } };
        ready?: () => void;
      };
    };
  }
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const activeTripId = useAppStore((state) => state.activeTripId);
  const setActiveTripId = useAppStore((state) => state.setActiveTripId);
  const setTelegramUserId = useAppStore((state) => state.setTelegramUserId);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    setTelegramUserId(String(telegramId ?? "local-dev-user"));
  }, [setTelegramUserId]);

  return (
    <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">PackMate</h1>
        <p className="text-sm text-slate-600">Telegram Mini App для packing list и совместной сборки</p>
      </header>

      {view !== "home" && (
        <button className="mb-3 text-sm text-blue-700" onClick={() => setView("home")}>
          ← Назад
        </button>
      )}

      {view === "home" && (
        <HomeScreen
          onCreate={() => setView("create")}
          onOpenTrip={(tripId) => {
            setActiveTripId(tripId);
            setView("list");
          }}
        />
      )}
      {view === "create" && (
        <CreateTripScreen
          onCreated={(tripId) => {
            setActiveTripId(tripId);
            setView("list");
          }}
        />
      )}
      {view === "list" && activeTripId && <PackingListScreen tripId={activeTripId} />}
    </main>
  );
}
