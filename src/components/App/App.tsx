import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchNotes } from '../../services/noteService';
import type { NotesResponse } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import { useDebounce } from 'use-debounce';
import { keepPreviousData } from '@tanstack/react-query';

import css from './App.module.css';

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const query = useQuery<NotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const data = query.data;
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {query.isLoading && <Loader />}
      {query.isError && <ErrorMessage />}
      {!query.isLoading && notes.length === 0 && <p>No notes found.</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </NoteModal>
      )}
    </div>
  );
};

export default App;
