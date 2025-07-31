import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const client = await createDatabaseClient()
    
    const startTime = Date.now()
    const result = await client.query(query)
    const executionTime = Date.now() - startTime
    
    await client.end()

    return NextResponse.json({
      success: true,
      data: result.rows,
      fields: result.fields?.map((field: any) => ({
        name: field.name,
        dataTypeID: field.dataTypeID,
        dataTypeSize: field.dataTypeSize,
        dataTypeModifier: field.dataTypeModifier,
        format: field.format
      })) || [],
      rowCount: result.rowCount,
      executionTime,
      query
    })
  } catch (error) {
    console.error('Query execution error:', error)
    return NextResponse.json(
      { 
        error: 'Query execution failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}