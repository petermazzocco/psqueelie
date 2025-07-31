import { NextResponse } from 'next/server'
import { createDatabaseClient } from '@/lib/db'

export async function GET() {
  try {
    const client = await createDatabaseClient()
    
    const result = await client.query('SELECT version()')
    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      version: result.rows[0].version
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        error: 'Connection failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}