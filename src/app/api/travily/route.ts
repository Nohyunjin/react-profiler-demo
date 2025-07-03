import { TravelySearchResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const TRAVILY_API_KEY = process.env.TRAVILY_API_KEY;

    if (!TRAVILY_API_KEY) {
      return NextResponse.json(
        { error: 'Travily API key not configured' },
        { status: 500 }
      );
    }

    // Travily API 호출
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TRAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: 'basic',
        include_answer: false,
        include_raw_content: false,
        max_results: 5,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Travily API error: ${response.status}`);
    }

    const data = await response.json();

    const searchResponse: TravelySearchResponse = {
      query,
      results:
        data.results?.map(
          (result: {
            title: string;
            url: string;
            content: string;
            score?: number;
          }) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            score: result.score,
          })
        ) || [],
    };

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Travily search error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
