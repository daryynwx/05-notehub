import axios from 'axios';
import type { NewNote, Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api'; 
// Настраиваем базовый URL один раз
const api = axios.create({
  baseURL: BASE_URL,
});

// Создание новой заметки
export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', newNote);
  return data;
};

// Получение заметок с поиском и пагинацией
export const fetchNotes = async (
  search: string,
  page: number
): Promise<Note[]> => {
  const { data } = await api.get<Note[]>('/notes', {
    params: { q: search, _page: page, _limit: 10 },
  });
  return data;
};

// Удаление заметки по id
export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};
