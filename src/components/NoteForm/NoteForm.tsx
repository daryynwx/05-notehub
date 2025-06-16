import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createNote } from '../../services/noteService';
import type { NewNote, Note } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string(),
  tag: Yup.mixed<NewNote['tag']>()
    .oneOf(['Todo', 'work', 'personal', 'meeting', 'shopping'])
    .required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, NewNote>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik<NewNote>
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const noteToSend = {
          title: values.title.trim(),
          content: values.content?.trim() || '',
          tag: values.tag as NewNote['tag'],
        };
        mutation.mutate(noteToSend);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              disabled={mutation.isPending || isSubmitting}
              className={css.input}
            />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              disabled={mutation.isPending || isSubmitting}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              id="tag"
              name="tag"
              as="select"
              disabled={mutation.isPending || isSubmitting}
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="meeting">Meeting</option>
              <option value="shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              disabled={mutation.isPending || isSubmitting}
              className={css.submitButton}
            >
              {mutation.isPending || isSubmitting ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending || isSubmitting}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
