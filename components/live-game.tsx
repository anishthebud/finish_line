"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface GameState {
  homeTeam: {
    name: string
    score: number
    possession: boolean
  }
  awayTeam: {
    name: string
    score: number
    possession: boolean
  }
  quarter: number
  timeRemaining: string
  lastUpdate: string
}

export default function LiveGame() {
  const [gameStates, setGameStates] = useState<GameState[]>([])

  useEffect(() => {
    const eventSource = new EventSource("/api/get-games")

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.game_states && Array.isArray(data.game_states)) {
          // Update state with array of game objects
          setGameStates(data.game_states)
        }
      } catch (error) {
        console.error("Failed to parse game state:", error)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="space-y-6">
      {gameStates.length > 0 ? (
        gameStates.map((game) => (
          <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Live Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-xl font-semibold">{game.homeTeam.name}</p>
                  <p className="text-3xl font-bold">{game.homeTeam.score}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xl font-semibold">{game.awayTeam.name}</p>
                  <p className="text-3xl font-bold">{game.awayTeam.score}</p>
                </div>
              </div>
              <Progress value={33} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Last update: {gameState.lastUpdate || "Waiting for updates..."}
              </div>
            </div>
          </CardContent>
        </Card>
        ))
      ) : (
        <p>No live games available.</p>
      )}
    </div>
  )
}

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Live Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xl font-semibold">{gameState.homeTeam.name}</p>
              <p className="text-3xl font-bold">{gameState.homeTeam.score}</p>
              {gameState.homeTeam.possession && (
                <span className="inline-block px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                  Possession
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Q{gameState.quarter}</p>
              <p className="text-xl">{gameState.timeRemaining}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xl font-semibold">{gameState.awayTeam.name}</p>
              <p className="text-3xl font-bold">{gameState.awayTeam.score}</p>
              {gameState.awayTeam.possession && (
                <span className="inline-block px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                  Possession
                </span>
              )}
            </div>
          </div>
          <Progress value={33} className="h-2" />
          <div className="text-sm text-muted-foreground">
            Last update: {gameState.lastUpdate || "Waiting for updates..."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

