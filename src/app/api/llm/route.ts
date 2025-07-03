import { SearchResult } from '@/lib/types';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, searchResults } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // RAG 컨텍스트 구성
    const context =
      searchResults?.length > 0
        ? `다음은 검색 결과입니다:\n\n${searchResults
            .map(
              (result: SearchResult, index: number) =>
                `${index + 1}. ${result.title}\n${result.content}\n출처: ${
                  result.url
                }\n`
            )
            .join(
              '\n'
            )}\n\n위 검색 결과를 바탕으로 다음 질문에 아주 상세하게 답변해주세요:\n\n`
        : '';

    const prompt = `${context}${message}`;
    console.log(prompt);

    // OpenAI API 스트리밍 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 도움이 되는 AI 어시스턴트입니다. 제공된 검색 결과를 바탕으로 정확하고 유용한 답변을 제공해주세요. 답변할 때는 출처를 명시해주세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true, // 스트리밍 활성화
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // 스트리밍 응답을 위한 ReadableStream 생성
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // 완료 신호 전송
              controller.enqueue(
                encoder.encode(
                  `data: {"type":"done","sources":${JSON.stringify(
                    searchResults || []
                  )}}\n\n`
                )
              );
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);

                if (data === '[DONE]') {
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;

                  if (content) {
                    // 텍스트 청크 전송
                    controller.enqueue(
                      encoder.encode(
                        `data: {"type":"chunk","content":${JSON.stringify(
                          content
                        )}}\n\n`
                      )
                    );
                  }
                } catch {
                  // JSON 파싱 에러 무시
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: {"type":"error","error":"스트리밍 중 오류가 발생했습니다."}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('LLM API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
