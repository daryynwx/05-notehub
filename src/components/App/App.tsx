import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';
import type { NotesResponse } from '../../types/note';

const limit = 10;

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, limit }),
    placeholderData: { notes: [], total: 0 },
  });

  // Мутация удаления заметки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // После успешного удаления обновляем кеш (перезапрашиваем заметки)
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Функция удаления заметки, передается в NoteList
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={handlePageChange} />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong!</p>}

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      ) : (
        !isLoading && <p>No notes found.</p>
      )}

      {isModalOpen && (
        <NoteModal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </NoteModal>
      )}
    </div>
  );
};

export default App;
