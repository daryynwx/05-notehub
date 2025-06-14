import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
  currentPage: number;  // Добавляем сюда текущую страницу
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <ReactPaginate
      className={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.pageItemActive}
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      forcePage={currentPage - 1}  // Вот этот проп говорит ReactPaginate, какая страница активна (нумерация с 0)
      onPageChange={(e) => onPageChange(e.selected + 1)}
    />
  );
};

export default Pagination;
