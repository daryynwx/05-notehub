import React from 'react';
import css from './NoteList.module.css';
import type { Note } from '../../types/note';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete }) => {
  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, text, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{text}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button className={css.button} onClick={() => onDelete(id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
