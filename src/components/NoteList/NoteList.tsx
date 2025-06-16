import React from 'react';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete }) => (
  <ul className={css.list}>
    {notes.map(({ id, title, content, tag }) => (
      <li key={id} className={css.listItem}>
        <h3 className={css.title}>{title}</h3>
        <p className={css.content}>{content}</p>
        <div className={css.footer}>
          <small className={css.tag}>Tag: {tag}</small>
          <button
            className={css.button}
            onClick={() => onDelete(id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default NoteList;
