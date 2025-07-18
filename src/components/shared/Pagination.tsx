import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IPagination {
  setPage: Dispatch<SetStateAction<number>>;
  totalCount: number;
  currentPage: number;
  itemPerPage: number;
}
interface IPaginationItemProps {
  children: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
}

const PaginationItem: React.FC<IPaginationItemProps> = ({
  children,
  onClick,
  isDisabled = false,
  isActive = false,
}) => {
  const baseStyle = 'text-neutral-400 hover:text-white';
  const disabledStyle = 'text-neutral-400 opacity-50';
  const activeStyle = isActive ? 'text-white border-b-2 border-peach-400' : '';
  const cursorStyle = isDisabled
    ? 'cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      className={`px-2 py-2 ${baseStyle} ${cursorStyle} ${activeStyle} ${
        isDisabled ? disabledStyle : ''
      }`}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

const Pagination = (props: IPagination) => {
  const { setPage, currentPage, totalCount, itemPerPage } = props;
  const [pages, setPages] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const nop = Math.ceil(totalCount / itemPerPage);
    const _pages: Array<string | number> = [];
    const current_page = currentPage + 1;
    // Loop through
    for (let i = 1; i <= nop; i++) {
      // Define offset
      const offset = i == 1 || nop ? itemPerPage + 1 : itemPerPage;
      // If added
      if (
        i == 1 ||
        (current_page - offset <= i && current_page + offset >= i) ||
        i == current_page ||
        i == nop
      ) {
        _pages.push(i);
      } else if (
        i == current_page - (offset + 1) ||
        i == current_page + (offset + 1)
      ) {
        _pages.push('...');
      }
    }
    setPages(_pages);
    setPageCount(nop);
  }, [totalCount, currentPage, itemPerPage]);

  if (pageCount < 2) return null;
  return (
    <div className='flex gap-2 justify-center mt-6 text-sm font-redHatText'>
      <PaginationItem
        onClick={() => {
          if (currentPage > 0) setPage(page => page - 1);
        }}
        isDisabled={currentPage === 0}
      >
        <span className='flex items-center'>‹ Prev</span>
      </PaginationItem>
      {pages.map((p, id) => (
        <PaginationItem
          key={id}
          onClick={() => {
            if (!isNaN(+p)) setPage(+p - 1);
          }}
          isActive={+p - 1 === currentPage}
        >
          {p}
        </PaginationItem>
      ))}

      <PaginationItem
        onClick={() => {
          if (currentPage + 1 < pageCount) setPage(page => page + 1);
        }}
        isDisabled={currentPage + 1 >= pageCount}
      >
        Next ›
      </PaginationItem>
    </div>
  );
};

export default Pagination;
