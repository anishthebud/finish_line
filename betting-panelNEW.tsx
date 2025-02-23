"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Bet {
  id: string
  type: string
  odds: number
  description: string
  category: "spread" | "moneyline" | "total" | "player"
}

interface BettingPanelProps {
  gameId: string
}

export default function BettingPanel({ gameId }: BettingPanelProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [bets, setBets] = useState<Bet[]>([])

  useEffect(() => {
    // This would normally fetch from an API
    // For demo, we'll generate some sample bets based on the gameId
    const generateBets = () => {
      const teams = gameId.split("-").map((team) => team.charAt(0).toUpperCase() + team.slice(1))
      return [
        {
          id: "1",
          type: "spread",
          odds: 1.91,
          description: `${teams[0]} -5.5`,
          category: "spread",
        },
        {
          id: "2",
          type: "spread",
          odds: 1.91,
          description: `${teams[1]} +5.5`,
          category: "spread",
        },
        {
          id: "3",
          type: "moneyline",
          odds: 1.74,
          description: `${teams[0]} to win`,
          category: "moneyline",
        },
        {
          id: "4",
          type: "moneyline",
          odds: 2.15,
          description: `${teams[1]} to win`,
          category: "moneyline",
        },
        {
          id: "5",
          type: "total",
          odds: 1.91,
          description: "Over 224.5",
          category: "total",
        },
        {
          id: "6",
          type: "total",
          odds: 1.91,
          description: "Under 224.5",
          category: "total",
        },
        {
          id: "7",
          type: "player",
          odds: 2.2,
          description: "LeBron James Over 27.5 Points",
          category: "player",
        },
        {
          id: "8",
          type: "player",
          odds: 2.1,
          description: "Stephen Curry Over 5.5 3PM",
          category: "player",
        },
      ] as Bet[]
    }

    setBets(generateBets())
  }, [gameId])

  const handlePlaceBet = async () => {
    if (!selectedBet || !betAmount) return

    try {
      const response = await fetch("/api/place-bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          betId: selectedBet.id,
          amount: Number.parseFloat(betAmount),
        }),
      })

      if (response.ok) {
        setBetAmount("")
        setSelectedBet(null)
        // Show success message
      }
    } catch (error) {
      console.error("Error placing bet:", error)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Betting</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spread" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="spread">Spread</TabsTrigger>
            <TabsTrigger value="moneyline">ML</TabsTrigger>
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="player">Player</TabsTrigger>
          </TabsList>
          {["spread", "moneyline", "total", "player"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {bets
                .filter((bet) => bet.category === category)
                .map((bet) => (
                  <div
                    key={bet.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedBet?.id === bet.id ? "border-primary bg-primary/5" : "hover:border-primary/50",
                    )}
                    onClick={() => setSelectedBet(bet)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{bet.description}</p>
                      <p className="text-lg font-bold">{bet.odds.toFixed(2)}x</p>
                    </div>
                  </div>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        {selectedBet && (
          <div className="mt-8 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="bet-amount">Bet Amount</Label>
              <Input
                id="bet-amount"
                type="number"
                min="1"
                step="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            {betAmount && (
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Potential win:</span>
                  <span className="font-medium">${(Number.parseFloat(betAmount) * selectedBet.odds).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Odds:</span>
                  <span>{selectedBet.odds.toFixed(2)}</span>
                </div>
              </div>
            )}
            <Button className="w-full" onClick={handlePlaceBet}>
              Place Bet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

