import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export const fetchNotes = async (
  page: number,
  search: string,
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params = { page, perPage: 12, ...(search ? { search } : {}) };
  const response = await axios.get<{ notes: Note[]; totalPages: number }>(BASE_URL, {
    headers,
    params,
  });
  return response.data;
};

// Исправленный интерфейс — теперь поле content, а не text
interface NewNote {
  title: string;
  content: string;  // <--- здесь content, а не text
  tag: Note['tag'];
}

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await axios.post<Note>(BASE_URL, note, { headers });
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, { headers });
  return response.data;
};
