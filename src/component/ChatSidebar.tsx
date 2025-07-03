'use client';

import { ChatSession } from '@/lib/types';
import clsx from 'clsx';
import { Cpu, MessageCircle, Plus, Sparkles } from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onCreateNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onCreateNewSession,
  onSelectSession,
}: ChatSidebarProps) {
  return (
    <div className='w-64 sidebar-dark text-white flex flex-col h-full'>
      {/* 헤더 */}
      <div className='p-4 border-b border-purple-500/20'>
        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-8 h-8 rounded-lg ai-gradient-2 flex items-center justify-center animate-gradient'>
              <Cpu size={16} className='text-white' />
            </div>
            <h2 className='font-bold text-lg neon-text'>AI Assistant</h2>
          </div>
          <p className='text-xs text-gray-400'>Powered by RAG Technology</p>
        </div>

        <button
          onClick={onCreateNewSession}
          className='w-full ai-button flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-white font-medium'
        >
          <Plus size={20} />
          <span>새로운 대화</span>
          <Sparkles size={16} className='ml-auto opacity-60' />
        </button>
      </div>

      {/* 채팅 세션 목록 */}
      <div className='flex-1 overflow-y-auto scrollbar-ai'>
        {sessions.length === 0 ? (
          <div className='p-4 text-gray-400 text-center'>
            <div className='w-16 h-16 mx-auto mb-3 rounded-full glass-card flex items-center justify-center float'>
              <MessageCircle size={24} className='opacity-50' />
            </div>
            <p className='text-sm'>아직 대화가 없습니다</p>
            <p className='text-xs text-gray-500 mt-1'>새 대화를 시작해보세요</p>
          </div>
        ) : (
          <div className='p-2 space-y-2'>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-lg transition-all duration-300 group relative overflow-hidden',
                  currentSessionId === session.id
                    ? 'glass-card glow-purple text-white'
                    : 'hover:glass-card text-gray-300 hover:text-white'
                )}
              >
                {/* 선택된 세션의 배경 효과 */}
                {currentSessionId === session.id && (
                  <div className='absolute inset-0 ai-gradient-2 opacity-10 animate-gradient'></div>
                )}

                <div className='flex items-start gap-3 relative z-10'>
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                      currentSessionId === session.id
                        ? 'ai-gradient-2 pulse-ai'
                        : 'bg-gray-700 group-hover:ai-gradient-2'
                    )}
                  >
                    <MessageCircle size={14} className='text-white' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium truncate'>
                      {session.title}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs text-gray-400'>
                        {session.messages.length}개 메시지
                      </span>
                      <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                      <span className='text-xs text-gray-500'>
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* 활성 인디케이터 */}
                  {currentSessionId === session.id && (
                    <div className='w-2 h-2 bg-purple-400 rounded-full pulse-ai'></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className='p-4 border-t border-purple-500/20'>
        <div className='text-center'>
          <div className='flex items-center justify-center gap-2 mb-1'>
            <div className='w-2 h-2 bg-green-400 rounded-full pulse-ai'></div>
            <span className='text-xs text-gray-400'>AI 서비스 활성</span>
          </div>
          <p className='text-xs text-gray-500'>실시간 검색 + AI 답변</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.getTime() === yesterday.getTime()) {
    return '어제';
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}
