import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h3 className={css.title}>{title}</h3>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <small className={css.tag}>Tag: {tag}</small>
            <button
              className={css.button}
              onClick={() => mutate(id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
