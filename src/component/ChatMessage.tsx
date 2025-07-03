'use client';

import { ChatMessage as ChatMessageType } from '@/lib/types';
import clsx from 'clsx';
import { Cpu, ExternalLink, Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex gap-4 p-6',
        isUser
          ? 'bg-gray-900/30'
          : 'bg-gradient-to-r from-purple-900/10 to-blue-900/10'
      )}
    >
      {/* 아바타 */}
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative',
          isUser
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'
            : 'ai-gradient-2 pulse-ai'
        )}
      >
        {isUser ? (
          <User size={18} className='text-white' />
        ) : (
          <>
            <Cpu size={18} className='text-white' />
            {/* AI 아바타 글로우 효과 */}
            <div className='absolute inset-0 rounded-xl ai-gradient-2 blur-sm opacity-30 animate-pulse'></div>
          </>
        )}
      </div>

      {/* 메시지 내용 */}
      <div className='flex-1 min-w-0'>
        {/* 헤더 */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='flex items-center gap-2'>
            <span
              className={clsx(
                'font-semibold',
                isUser ? 'text-gray-200' : 'neon-text'
              )}
            >
              {isUser ? '사용자' : 'AI 어시스턴트'}
            </span>
            {!isUser && (
              <div className='flex items-center gap-1'>
                <Sparkles size={14} className='text-purple-400 animate-pulse' />
                <span className='text-xs px-2 py-1 rounded-full ai-gradient text-white font-medium'>
                  RAG
                </span>
                {isStreaming && (
                  <span className='text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium animate-pulse'>
                    타이핑 중
                  </span>
                )}
              </div>
            )}
          </div>
          <span className='text-xs text-gray-500'>
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* 메시지 버블 */}
        <div
          className={clsx(
            'rounded-2xl p-4 relative overflow-hidden',
            isUser ? 'message-user' : 'message-ai glass-card'
          )}
        >
          {/* AI 메시지 배경 효과 */}
          {!isUser && (
            <div className='absolute inset-0 ai-gradient-2 opacity-5 animate-gradient'></div>
          )}

          <div className='relative z-10'>
            <p className='text-gray-100 whitespace-pre-wrap leading-relaxed'>
              {message.content}
              {/* 스트리밍 중 커서 효과 */}
              {isStreaming && !isUser && (
                <span
                  className='inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse'
                  style={{ animation: 'blink 1s infinite' }}
                />
              )}
            </p>
          </div>
        </div>

        {/* 검색 결과 표시 (AI 메시지에만) */}
        {!isUser &&
          message.searchResults &&
          message.searchResults.length > 0 && (
            <div className='mt-4'>
              <div className='glass-card rounded-xl p-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-6 h-6 rounded-lg ai-gradient flex items-center justify-center'>
                    <ExternalLink size={12} className='text-white' />
                  </div>
                  <h4 className='text-sm font-semibold text-purple-300'>
                    참고한 검색 결과
                  </h4>
                  <div className='w-2 h-2 bg-green-400 rounded-full pulse-ai ml-auto'></div>
                </div>

                <div className='space-y-3'>
                  {message.searchResults.slice(0, 3).map((result, index) => (
                    <div key={index} className='group'>
                      <a
                        href={result.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-purple-500/30'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0'>
                            <span className='text-xs font-bold text-white'>
                              {index + 1}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h5 className='text-blue-300 group-hover:text-blue-200 font-medium text-sm mb-1 flex items-center gap-2'>
                              {result.title}
                              <ExternalLink
                                size={12}
                                className='opacity-50 group-hover:opacity-100 transition-opacity'
                              />
                            </h5>
                            <p className='text-gray-400 text-xs line-clamp-2 mb-2'>
                              {result.content.slice(0, 120)}...
                            </p>
                            <div className='flex items-center gap-2'>
                              <span className='text-xs text-gray-500 truncate flex-1'>
                                {new URL(result.url).hostname}
                              </span>
                              {result.score && (
                                <span className='text-xs px-2 py-1 rounded-full bg-purple-900/50 text-purple-300'>
                                  {(result.score * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
