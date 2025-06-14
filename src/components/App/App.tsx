import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';
import type { Note } from '../../types/note';

const App: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [isModalOpen, setModalOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
    },
    onError: (error: any) => {
      if (error.response) {
        console.error('📛 Server responded with error:');
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSearch = (val: string) => {
    setSearch(val);
  };
  

  const handleSubmit = (vals: { title: string; content: string; tag: string }) => {
    const newNote = {
      title: vals.title,
      content: vals.content,  // обязательно "content", а не "text"
      tag: vals.tag as Note['tag'],
    };
  
    console.log('📤 Отправляем:', newNote);
    createMutation.mutate(newNote);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {!!data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
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
