'use client';

import { useChat } from '@/hooks/useChat';
import { Cpu, Globe, Sparkles, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatSidebar } from './ChatSidebar';
import { SearchResults } from './SearchResults';
import { TypingIndicator } from './TypingIndicator';

export function ChatInterface() {
  const {
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
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // 컴포넌트 마운트 시 첫 번째 세션 생성
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  return (
    <div className='h-screen flex bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20'>
      {/* 왼쪽 사이드바 */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateNewSession={createNewSession}
        onSelectSession={selectSession}
      />

      {/* 메인 채팅 영역 */}
      <div className='flex-1 flex'>
        {/* 채팅 메시지 영역 */}
        <div className='flex-1 flex flex-col'>
          {/* 채팅 헤더 */}
          <div className='glass-card border-b border-purple-500/20 px-6 py-4 relative overflow-hidden'>
            {/* 헤더 배경 효과 */}
            <div className='absolute inset-0 ai-gradient-2 opacity-10 animate-gradient'></div>

            <div className='flex items-center justify-between relative z-10'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-2xl ai-gradient-2 flex items-center justify-center pulse-ai'>
                  <Cpu size={24} className='text-white' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold neon-text flex items-center gap-2'>
                    RAG AI Assistant
                    <Sparkles
                      size={20}
                      className='text-purple-400 animate-pulse'
                    />
                  </h1>
                  <p className='text-sm text-gray-400 flex items-center gap-2'>
                    <Globe size={14} />
                    실시간 검색과 AI가 결합된 지능형 어시스턴트
                  </p>
                </div>
              </div>

              {/* 상태 인디케이터 */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2 px-3 py-1.5 rounded-full glass-card'>
                  <div className='w-2 h-2 bg-green-400 rounded-full pulse-ai'></div>
                  <span className='text-xs text-gray-300'>온라인</span>
                </div>
                {isLoading && (
                  <div className='flex items-center gap-2 px-3 py-1.5 rounded-full ai-gradient'>
                    <Zap size={12} className='text-white animate-pulse' />
                    <span className='text-xs text-white font-medium'>
                      처리중
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className='flex-1 overflow-y-auto scrollbar-ai'>
            {currentSession?.messages.length === 0 ? (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center max-w-md mx-auto p-8'>
                  {/* 중앙 로고 */}
                  <div className='w-24 h-24 mx-auto mb-6 rounded-3xl ai-gradient-2 flex items-center justify-center float relative'>
                    <Cpu size={40} className='text-white' />
                    <div className='absolute inset-0 rounded-3xl ai-gradient-2 blur-xl opacity-30 animate-pulse'></div>
                  </div>

                  <h3 className='text-2xl font-bold neon-text mb-3'>
                    AI와 대화를 시작하세요
                  </h3>
                  <p className='text-gray-400 mb-6 leading-relaxed'>
                    궁금한 것이 있으면 언제든 물어보세요!
                    <br />
                    실시간 웹 검색으로 최신 정보를 제공합니다.
                  </p>

                  {/* 기능 소개 */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8'>
                    <div className='glass-card p-4 rounded-xl text-center'>
                      <Globe size={24} className='mx-auto mb-2 text-blue-400' />
                      <h4 className='text-sm font-semibold text-gray-200 mb-1'>
                        실시간 검색
                      </h4>
                      <p className='text-xs text-gray-500'>최신 정보 검색</p>
                    </div>
                    <div className='glass-card p-4 rounded-xl text-center'>
                      <Sparkles
                        size={24}
                        className='mx-auto mb-2 text-purple-400'
                      />
                      <h4 className='text-sm font-semibold text-gray-200 mb-1'>
                        AI 분석
                      </h4>
                      <p className='text-xs text-gray-500'>지능형 답변 생성</p>
                    </div>
                    <div className='glass-card p-4 rounded-xl text-center'>
                      <Zap size={24} className='mx-auto mb-2 text-yellow-400' />
                      <h4 className='text-sm font-semibold text-gray-200 mb-1'>
                        빠른 응답
                      </h4>
                      <p className='text-xs text-gray-500'>즉시 결과 제공</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='min-h-full'>
                {currentSession?.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isStreaming={streamingMessageId === message.id}
                  />
                ))}
                {isLoading && !streamingMessageId && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 채팅 입력 */}
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={!currentSessionId}
          />
        </div>

        {/* 오른쪽 검색 결과 영역 */}
        <div className='w-80 p-4 overflow-y-auto scrollbar-ai'>
          <SearchResults results={searchResults} isLoading={isSearching} />
        </div>
      </div>
    </div>
  );
}
