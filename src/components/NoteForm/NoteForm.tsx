import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '../../services/noteService';

import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

// ✅ Валідаційна схема Yup
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string(), // опціонально
  tag: Yup.string().required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  // ✅ Мутація через useMutation
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error) => {
      console.error('Create note error:', error);
    },
  });

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo',
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.touched.title && formik.errors.title && (
          <div className={css.error}>{formik.errors.title}</div>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
        />
        {formik.touched.content && formik.errors.content && (
          <div className={css.error}>{formik.errors.content}</div>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formik.values.tag}
          onChange={formik.handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <div className={css.error}>{formik.errors.tag}</div>
        )}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
