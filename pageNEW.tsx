import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import LiveGame from "@/components/live-game"
import BettingPanel from "@/components/betting-panel"

interface GamePageProps {
  params: {
    gameId: string
  }
}

const validGames = ["lakers-warriors", "celtics-heat", "bucks-suns"]

export default function GamePage({ params }: GamePageProps) {
  if (!validGames.includes(params.gameId)) {
    notFound()
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </Link>
        </div>
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <LiveGame gameId={params.gameId} />
          <div className="lg:h-[calc(100vh-10rem)] lg:sticky lg:top-8">
            <BettingPanel gameId={params.gameId} />
          </div>
        </div>
      </div>
    </main>
  )
}

