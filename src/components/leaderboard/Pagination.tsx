'use client';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPagesToShow = 5;

  const pages = [];
  const startPage = Math.max(
    0,
    Math.min(
      currentPage - Math.floor(maxPagesToShow / 2),
      totalPages - maxPagesToShow,
    ),
  );
  const endPage = Math.min(totalPages, startPage + maxPagesToShow);

  if (currentPage > 0) {
    pages.push(
      <button
        key='prev'
        onClick={() => onPageChange(currentPage - 1)}
        className='text-neutral-400 hover:text-white'
      >
        ‹ Prev
      </button>,
    );
  }

  if (startPage > 0) {
    pages.push(
      <button
        key={0}
        onClick={() => onPageChange(0)}
        className='text-neutral-400 hover:text-white px-2'
      >
        1
      </button>,
    );
    if (startPage > 1) {
      pages.push(
        <span key='start-ellipsis' className='px-2'>
          …
        </span>,
      );
    }
  }

  for (let i = startPage; i < endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-2 ${
          i === currentPage
            ? 'text-white border-b-2 border-peach-400'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        {i + 1}
      </button>,
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key='end-ellipsis' className='px-2'>
          …
        </span>,
      );
    }
    pages.push(
      <button
        key={totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
        className='text-neutral-400 hover:text-white px-2'
      >
        {totalPages}
      </button>,
    );
  }

  if (currentPage + 1 < totalPages) {
    pages.push(
      <button
        key='next'
        onClick={() => onPageChange(currentPage + 1)}
        className='text-neutral-400 hover:text-white'
      >
        Next ›
      </button>,
    );
  }

  return (
    <div className='flex gap-2 justify-center mt-6 text-sm font-redHatText'>
      {pages}
    </div>
  );
};
