import LiveGame from "@/components/live-game"
import BettingPanel from "@/components/betting-panel"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">NBA Live Tracker & Betting</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <LiveGame />
          <BettingPanel />
        </div>
      </div>
    </main>
  )
}

