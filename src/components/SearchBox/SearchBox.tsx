import React, { type ChangeEvent } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export default SearchBox;
