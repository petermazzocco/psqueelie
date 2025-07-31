'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Play } from 'lucide-react'
import { QueryResult } from '@/components/dashboard-client'

interface QueryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResult: (result: QueryResult) => void
  onStart?: () => void
  onError?: () => void
}

export function QueryDialog({ 
  open, 
  onOpenChange, 
  onResult,
  onStart,
  onError
}: QueryDialogProps) {
  const [query, setQuery] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeQuery = async () => {
    if (!query.trim()) return

    setIsExecuting(true)
    setError(null)
    onStart?.()

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Query execution failed')
      }

      const queryResult: QueryResult = {
        id: `query-${Date.now()}`,
        query: query.trim(),
        data: result.data,
        fields: result.fields,
        rowCount: result.rowCount,
        executionTime: result.executionTime,
        timestamp: new Date(),
      }

      onResult(queryResult)
      setQuery('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed')
      onError?.()
    } finally {
      setIsExecuting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      executeQuery()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Execute SQL Query</DialogTitle>
          <DialogDescription>
            Write your SQL query below. Press Cmd/Ctrl + Enter to execute.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM users WHERE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[200px] font-mono"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button 
              onClick={executeQuery}
              disabled={isExecuting || !query.trim()}
            >
              {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isExecuting && <Play className="mr-2 h-4 w-4" />}
              {isExecuting ? 'Executing...' : 'Execute Query'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}