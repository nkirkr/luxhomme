'use client'

import { useEffect, useState } from 'react'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const chatEnabled = process.env.NEXT_PUBLIC_FEATURE_CHAT === 'true'
  if (!chatEnabled) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 rounded-lg border bg-card p-4 shadow-lg sm:w-96">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-semibold">Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="h-64 overflow-y-auto py-4">
            <p className="text-center text-sm text-muted-foreground">
              Chat widget placeholder. Connect a chat provider in .env
            </p>
          </div>
          <div className="border-t pt-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Toggle chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  )
}
