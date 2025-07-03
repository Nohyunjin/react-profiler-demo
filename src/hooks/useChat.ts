'use client';

import { ChatMessage, ChatSession, SearchResult } from '@/lib/types';
import axios from 'axios';
import { useCallback, useState } from 'react';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const currentSession = sessions.find(
    (session) => session.id === currentSessionId
  );

  const createNewSession = useCallback(() => {
    const sessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: sessionId,
      title: '새 대화',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(sessionId);
    setSearchResults([]);

    return sessionId;
  }, []);

  const selectSession = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId);
      const session = sessions.find((s) => s.id === sessionId);
      if (session && session.messages.length > 0) {
        const lastMessage = session.messages[session.messages.length - 1];
        setSearchResults(lastMessage.searchResults || []);
      } else {
        setSearchResults([]);
      }
    },
    [sessions]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentSessionId) return;

      setIsLoading(true);
      setIsSearching(true);

      try {
        // 사용자 메시지 추가
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content,
          role: 'user',
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, userMessage],
                  title:
                    session.messages.length === 0
                      ? content.slice(0, 30) + '...'
                      : session.title,
                  updatedAt: new Date(),
                }
              : session
          )
        );

        // Travily 검색 수행
        const searchResponse = await axios.post('/api/travily', {
          query: content,
        });
        const results = searchResponse.data.results;
        setSearchResults(results);
        setIsSearching(false);

        // AI 메시지 초기화 (스트리밍용 빈 메시지)
        const assistantMessageId = (Date.now() + 1).toString();
        setStreamingMessageId(assistantMessageId);

        const initialAssistantMessage: ChatMessage = {
          id: assistantMessageId,
          content: '',
          role: 'assistant',
          timestamp: new Date(),
          // 검색 결과는 스트리밍 완료 시 추가됨
        };

        setSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, initialAssistantMessage],
                  updatedAt: new Date(),
                }
              : session
          )
        );

        // 스트리밍 LLM 요청
        const response = await fetch('/api/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            searchResults: results,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No reader available');
        }

        let accumulatedContent = '';

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();

                if (!data) continue;

                try {
                  const parsed = JSON.parse(data);

                  if (parsed.type === 'chunk' && parsed.content) {
                    accumulatedContent += parsed.content;

                    // 실시간으로 메시지 업데이트
                    setSessions((prev) =>
                      prev.map((session) =>
                        session.id === currentSessionId
                          ? {
                              ...session,
                              messages: session.messages.map((msg) =>
                                msg.id === assistantMessageId
                                  ? { ...msg, content: accumulatedContent }
                                  : msg
                              ),
                              updatedAt: new Date(),
                            }
                          : session
                      )
                    );
                  } else if (parsed.type === 'done') {
                    // 스트리밍 완료 - 검색 결과 최종 업데이트
                    setStreamingMessageId(null);
                    setSessions((prev) =>
                      prev.map((session) =>
                        session.id === currentSessionId
                          ? {
                              ...session,
                              messages: session.messages.map((msg) =>
                                msg.id === assistantMessageId
                                  ? {
                                      ...msg,
                                      searchResults: parsed.sources || results,
                                    }
                                  : msg
                              ),
                              updatedAt: new Date(),
                            }
                          : session
                      )
                    );
                  } else if (parsed.type === 'error') {
                    throw new Error(parsed.error || '스트리밍 오류');
                  }
                } catch (parseError) {
                  console.error('Parse error:', parseError);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        console.error('Error sending message:', error);

        // 에러 메시지 추가
        const errorMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          role: 'assistant',
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, errorMessage],
                  updatedAt: new Date(),
                }
              : session
          )
        );
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setStreamingMessageId(null);
      }
    },
    [currentSessionId]
  );

  return {
    sessions,
    currentSession,
    currentSessionId,
    searchResults,
    isLoading,
    isSearching,
    streamingMessageId,
    createNewSession,
    selectSession,
    sendMessage,
  };
};
