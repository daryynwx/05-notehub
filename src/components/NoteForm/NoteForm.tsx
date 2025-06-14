import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';

import type { Note } from '../../types/note';

interface NoteFormProps {
  onSubmit: (values: Omit<Note, 'id'>) => void;
  onCancel: () => void;
}

const allowedTags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(allowedTags as readonly string[])
    .required(),
});

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel }) => (
  <Formik
    initialValues={{ title: '', content: '', tag: 'Todo' }}  // <-- значение из allowedTags
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isValid, isSubmitting }) => (
      <Form className={css.form}>
        {['title', 'content', 'tag'].map(name => (
          <div className={css.formGroup} key={name}>
            <label htmlFor={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
            {name !== 'tag' ? (
              name === 'content' ? (
                <Field as="textarea" id={name} name={name} rows={8} className={css.textarea} />
              ) : (
                <Field id={name} name={name} className={css.input} />
              )
            ) : (
              <Field as="select" id="tag" name="tag" className={css.select}>
                {allowedTags.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage name={name} component="span" className={css.error} />
          </div>
        ))}
        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
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

export default NoteForm;
