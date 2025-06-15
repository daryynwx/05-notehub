import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';
import type { Note } from '../../types/note';

interface NoteFormProps {
  onClose: () => void;
}

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<Note['tag']>().oneOf(tags).required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('❌ Error creating note:', error);
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate({
        ...values,
        tag: values.tag as Note['tag'], // або as Tag
      })}
      
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          {['title', 'content', 'tag'].map((name) => (
            <div className={css.formGroup} key={name}>
              <label htmlFor={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
              {name === 'content' ? (
                <Field as="textarea" id="content" name="content" rows={6} className={css.textarea} />
              ) : name === 'tag' ? (
                <Field as="select" id="tag" name="tag" className={css.select}>
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field id="title" name="title" className={css.input} />
              )}
              <ErrorMessage name={name} component="span" className={css.error} />
            </div>
          ))}
          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={!isValid || isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
