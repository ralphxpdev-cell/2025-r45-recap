import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">2025 R45 Recap</h1>
          <div className="space-y-6">
            <div className="p-8 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Your React App</h2>
              <p className="text-muted-foreground mb-6">
                This is a modern React application built with Vite, TypeScript, and Tailwind CSS.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCount((count) => count - 1)}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  -
                </button>
                <div className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-bold text-xl">
                  Count: {count}
                </div>
                <button
                  onClick={() => setCount((count) => count + 1)}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
