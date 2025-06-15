import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';

const limit = 10; // лимит на страницу

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPage(1); 
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page,
        limit,
      }),
    placeholderData: {
      notes: [],
      total: 0,
    },
  });

  // Вычисляем количество страниц
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {!!totalPages && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong!</p>}
      {data?.notes && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <NoteModal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </NoteModal>
      )}
    </div>
  );
};

export default App;
