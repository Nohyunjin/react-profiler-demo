'use client';

import { SearchResult } from '@/lib/types';
import { Clock, ExternalLink, Globe, Search, Zap } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  // 검색 중 상태
  if (isLoading) {
    return (
      <div className='glass-card rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 rounded-lg ai-gradient-2 flex items-center justify-center animate-gradient'>
            <Search size={16} className='text-white animate-spin' />
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold neon-text'>웹 검색 중...</h3>
            <div className='flex items-center gap-2 mt-1'>
              <Clock size={12} className='text-yellow-400' />
              <span className='text-xs text-gray-400'>Travily API 호출 중</span>
            </div>
          </div>
          <div className='w-2 h-2 bg-yellow-400 rounded-full pulse-ai'></div>
        </div>

        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='p-4 rounded-lg bg-gray-800/30 border border-gray-700/50'
            >
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-lg bg-gray-700/50 shimmer'></div>
                <div className='flex-1 space-y-2'>
                  <div
                    className='h-4 bg-gray-700/50 rounded shimmer'
                    style={{ width: `${70 + i * 10}%` }}
                  ></div>
                  <div className='h-3 bg-gray-700/50 rounded shimmer'></div>
                  <div
                    className='h-3 bg-gray-700/50 rounded shimmer'
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 로딩 상태 표시 */}
        <div className='mt-4 flex items-center justify-center gap-2 text-purple-400'>
          <div className='typing-indicator'>
            <div className='typing-dot'></div>
            <div className='typing-dot'></div>
            <div className='typing-dot'></div>
          </div>
          <span className='text-sm'>최신 정보를 검색하고 있습니다</span>
        </div>
      </div>
    );
  }

  // 검색 결과 없음 (초기 상태)
  if (results.length === 0) {
    return (
      <div className='glass-card rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center'>
            <Search size={16} className='text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-300'>검색 결과</h3>
        </div>

        <div className='text-center py-8'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full glass-card flex items-center justify-center float'>
            <Globe size={32} className='text-gray-500' />
          </div>
          <p className='text-gray-400 mb-2'>검색 준비 완료</p>
          <p className='text-gray-600 text-sm'>
            질문을 입력하면 실시간으로 웹을 검색합니다
          </p>
        </div>
      </div>
    );
  }

  // 검색 결과 표시
  return (
    <div className='search-panel rounded-xl p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 rounded-lg ai-gradient-2 flex items-center justify-center pulse-ai'>
          <Search size={16} className='text-white' />
        </div>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold neon-text'>검색 결과 발견!</h3>
          <div className='flex items-center gap-2 mt-1'>
            <Zap size={12} className='text-green-400' />
            <span className='text-xs text-gray-400'>
              {results.length}개 발견
            </span>
            <div className='w-1 h-1 bg-gray-500 rounded-full'></div>
            <span className='text-xs text-green-400'>완료</span>
          </div>
        </div>
        <div className='w-2 h-2 bg-green-400 rounded-full pulse-ai'></div>
      </div>

      <div className='space-y-3'>
        {results.map((result, index) => (
          <div key={index} className='group'>
            <a
              href={result.url}
              target='_blank'
              rel='noopener noreferrer'
              className='block p-4 rounded-xl bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-300 border border-gray-700/30 hover:border-purple-500/50 hover:glow-purple'
            >
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <span className='text-xs font-bold text-white'>
                    {index + 1}
                  </span>
                </div>

                <div className='flex-1 min-w-0'>
                  <h4 className='text-blue-300 group-hover:text-blue-200 font-medium text-sm mb-2 flex items-center gap-2'>
                    <span className='truncate'>{result.title}</span>
                    <ExternalLink
                      size={12}
                      className='opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0'
                    />
                  </h4>

                  <p className='text-gray-400 text-xs line-clamp-3 mb-3 leading-relaxed'>
                    {result.content}
                  </p>

                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <Globe
                        size={12}
                        className='text-gray-500 flex-shrink-0'
                      />
                      <span className='text-xs text-gray-500 truncate'>
                        {new URL(result.url).hostname}
                      </span>
                    </div>

                    {result.score && (
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                        <span className='text-xs px-2 py-1 rounded-full bg-purple-900/50 text-purple-300 font-medium'>
                          {(result.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* 하단 상태 */}
      <div className='mt-6 pt-4 border-t border-gray-700/30'>
        <div className='flex items-center justify-center gap-2 text-gray-500 text-xs'>
          <Zap size={12} className='text-yellow-400' />
          <span>Powered by Travily Search</span>
          <div className='w-1 h-1 bg-gray-500 rounded-full'></div>
          <span className='text-green-400'>AI 분석 준비 완료</span>
        </div>
      </div>
    </div>
  );
}
