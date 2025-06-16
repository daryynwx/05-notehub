import React, { useState, type FormEvent } from 'react';
import css from './NoteForm.module.css';
import { createNote } from '../../services/noteService'; // импортируем функцию создания заметки
import { useQueryClient } from '@tanstack/react-query';

interface NoteFormProps {
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Todo');

  const queryClient = useQueryClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createNote({ title, content, tag });
      // Правильный вызов invalidateQueries с объектом
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <input
      id="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className={css.input}
    />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <textarea
      id="content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      required
      className={css.textarea}
    />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <select
      id="tag"
      value={tag}
      onChange={(e) => setTag(e.target.value)}
      className={css.select}
    >
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </select>
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button type="submit" className={css.submitButton}>
      Save Note
    </button>
  </div>
</form>

  );
};

export default NoteForm;
