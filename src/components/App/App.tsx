import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';
import type { Note } from '../../types/note';

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (vals: Omit<Note, 'id'>) => {
    createMutation.mutate(vals);
  };
  

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {!!data?.totalPages && data.totalPages > 1 && (
          <Pagination pageCount={data.totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong!</p>}
      {data?.notes && <NoteList notes={data.notes} onDelete={handleDelete} />}

      {isModalOpen && (
        <NoteModal onClose={() => setModalOpen(false)}>
          <NoteForm onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </NoteModal>
      )}
    </div>
  );
};

export default App;
