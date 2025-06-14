import React, { type ChangeEvent, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [debounced] = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debounced.trim());
  }, [debounced, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default SearchBox;
