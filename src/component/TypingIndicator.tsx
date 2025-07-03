'use client';

import { Cpu, Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className='flex gap-4 p-6 bg-gradient-to-r from-purple-900/10 to-blue-900/10'>
      {/* AI 아바타 */}
      <div className='w-10 h-10 rounded-xl ai-gradient-2 pulse-ai flex items-center justify-center flex-shrink-0 relative'>
        <Cpu size={18} className='text-white' />
        <div className='absolute inset-0 rounded-xl ai-gradient-2 blur-sm opacity-30 animate-pulse'></div>
      </div>

      {/* 타이핑 내용 */}
      <div className='flex-1 min-w-0'>
        {/* 헤더 */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold neon-text'>AI 어시스턴트</span>
            <div className='flex items-center gap-1'>
              <Sparkles size={14} className='text-purple-400 animate-pulse' />
              <span className='text-xs px-2 py-1 rounded-full ai-gradient text-white font-medium'>
                RAG
              </span>
            </div>
          </div>
          <span className='text-xs text-gray-500'>지금</span>
        </div>

        {/* 타이핑 버블 */}
        <div className='message-ai glass-card rounded-2xl p-4 relative overflow-hidden'>
          {/* 배경 효과 */}
          <div className='absolute inset-0 ai-gradient-2 opacity-5 animate-gradient'></div>

          <div className='relative z-10 flex items-center gap-3'>
            <div className='typing-indicator'>
              <div className='typing-dot'></div>
              <div className='typing-dot'></div>
              <div className='typing-dot'></div>
            </div>
            <span className='text-gray-300 text-sm'>
              AI가 답변을 생성하고 있습니다...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
