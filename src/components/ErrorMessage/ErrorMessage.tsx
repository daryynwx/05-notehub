import React from 'react';
import css from './ErrorMessage.module.css';

const ErrorMessage: React.FC = () => {
  return <p className={css.message}>Something went wrong!</p>;
};

export default ErrorMessage;
