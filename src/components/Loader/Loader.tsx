import React from 'react';
import css from './Loader.module.css';

const Loader: React.FC = () => {
  return <p className={css.message}>Loading...</p>;
};

export default Loader;
