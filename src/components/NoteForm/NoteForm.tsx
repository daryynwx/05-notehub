import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';

import type { NewNote, Note } from '../../types/note';
import { createNote } from '../../api/notes';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов')
    .required('Обязательное поле'),
  content: Yup.string().max(500, 'Максимум 500 символов'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Неверный тег')
    .required('Обязательное поле'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, NewNote>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] }); // <-- здесь объект
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={validationSchema}
      onSubmit={(values: NewNote) => {
        mutation.mutate(values);
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Заголовок</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Содержание</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Категория</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
              disabled={mutation.status === 'pending'} 
            >
              Отмена
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isSubmitting || mutation.status === 'pending'} 
            >
              {mutation.status === 'pending' ? 'Сохранение...' : 'Создать заметку'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
