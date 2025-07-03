'use client';

import { Loader2, Send, Sparkles, Zap } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  disabled,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className='border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-xl p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='relative'>
          {/* 메인 입력 영역 */}
          <div className='glass-card rounded-2xl p-4 relative overflow-hidden'>
            {/* 배경 그라데이션 효과 */}
            <div className='absolute inset-0 ai-gradient-2 opacity-5 animate-gradient'></div>

            <div className='flex gap-4 items-end relative z-10'>
              <div className='flex-1'>
                <div className='relative'>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='AI에게 질문하세요... (Enter로 전송, Shift+Enter로 줄바꿈)'
                    className='w-full px-4 py-3 bg-transparent text-gray-100 placeholder-gray-400 border-none resize-none focus:outline-none text-base leading-relaxed'
                    rows={Math.min(Math.max(message.split('\n').length, 1), 4)}
                    disabled={isLoading || disabled}
                  />

                  {/* 포커스 시 글로우 효과 */}
                  <div className='absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none'></div>
                </div>
              </div>

              {/* 전송 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isLoading || disabled}
                className='ai-button px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium relative z-10'
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className='animate-spin' />
                    <span className='hidden sm:inline'>처리중</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span className='hidden sm:inline'>전송</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 힌트 텍스트 */}
          <div className='mt-3 flex items-center justify-between text-xs'>
            <div className='flex items-center gap-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <Sparkles size={12} className='text-purple-400' />
                <span>AI가 실시간으로 웹을 검색합니다</span>
              </div>
              {message.trim() && (
                <div className='flex items-center gap-1'>
                  <Zap size={12} className='text-yellow-400' />
                  <span>Enter로 전송 • Shift+Enter로 줄바꿈</span>
                </div>
              )}
            </div>

            {/* 문자 수 표시 */}
            <div className='text-gray-600'>
              {message.length > 0 && (
                <span
                  className={message.length > 1000 ? 'text-yellow-400' : ''}
                >
                  {message.length}/2000
                </span>
              )}
            </div>
          </div>

          {/* 로딩 상태 표시 */}
          {isLoading && (
            <div className='mt-4 flex items-center justify-center gap-3 text-purple-400'>
              <div className='typing-indicator'>
                <div className='typing-dot'></div>
                <div className='typing-dot'></div>
                <div className='typing-dot'></div>
              </div>
              <span className='text-sm'>AI가 답변을 생성하고 있습니다...</span>
            </div>
          )}
        </div>

        {/* 추천 질문들 (메시지가 없을 때만 표시) */}
        {!message && !isLoading && (
          <div className='mt-4'>
            <p className='text-xs text-gray-500 mb-2'>추천 질문:</p>
            <div className='flex flex-wrap gap-2'>
              {[
                '최신 AI 기술 동향은?',
                'React 19의 새로운 기능들',
                '2024년 프로그래밍 언어 순위',
                'Next.js vs Vue.js 비교',
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className='px-3 py-1.5 text-xs rounded-full bg-gray-800/50 hover:bg-gray-800/80 text-gray-400 hover:text-gray-200 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
