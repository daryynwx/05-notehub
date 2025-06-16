import axios from 'axios';
import type { Note, NotesResponse, NewNote } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

interface FetchNotesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchNotes = async ({
  search = '',
  page = 1,
  limit = 10,
}: FetchNotesParams): Promise<NotesResponse> => {
  const params: Record<string, any> = {
    page,
    perPage: limit,
  };
  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await axiosInstance.get<NotesResponse>('/notes', { params });
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await axiosInstance.post('/notes', note);
  return response.data;
};


export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/notes/${id}`);
  return response.data;
};
