import { NextResponse } from "next/server"

export async function GET() {
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      // This would normally connect to your Python script
      // For demo purposes, we'll send sample updates every few seconds
      const sendUpdate = () => {
        const gameState = {
          homeTeam: {
            name: "Lakers",
            score: Math.floor(Math.random() * 100),
            possession: Math.random() > 0.5,
          },
          awayTeam: {
            name: "Warriors",
            score: Math.floor(Math.random() * 100),
            possession: Math.random() > 0.5,
          },
          quarter: Math.ceil(Math.random() * 4),
          timeRemaining: "08:24",
          lastUpdate: new Date().toLocaleTimeString(),
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(gameState)}\n\n`))
      }

      // Send initial update
      sendUpdate()

      // Send updates every 3 seconds
      const interval = setInterval(sendUpdate, 3000)

      // Cleanup
      return () => {
        clearInterval(interval)
      }
    },
  })

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

