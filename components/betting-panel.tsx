"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Bet {
  type: string
  odds: number
  description: string
}

const SAMPLE_BETS: Bet[] = [
  {
    type: "next_score",
    odds: 1.95,
    description: "Next Score: 3-pointer",
  },
  {
    type: "point_spread",
    odds: 2.1,
    description: "Lakers -5.5 points",
  },
  {
    type: "next_timeout",
    odds: 3.5,
    description: "Next Timeout: Warriors",
  },
]

export default function BettingPanel() {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [betAmount, setBetAmount] = useState("")

  const handlePlaceBet = async () => {
    if (!selectedBet || !betAmount) return

    try {
      const response = await fetch("/api/place-bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betType: selectedBet.type,
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Live Betting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            {SAMPLE_BETS.map((bet) => (
              <div
                key={bet.type}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedBet?.type === bet.type ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedBet(bet)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{bet.description}</p>
                  <p className="text-lg font-bold">{bet.odds}x</p>
                </div>
              </div>
            ))}
          </div>

          {selectedBet && (
            <div className="space-y-4">
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
                <div className="text-sm">
                  Potential win: ${(Number.parseFloat(betAmount) * selectedBet.odds).toFixed(2)}
                </div>
              )}
              <Button className="w-full" onClick={handlePlaceBet}>
                Place Bet
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

