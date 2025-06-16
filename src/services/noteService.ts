// noteService.ts
import axios from 'axios';

const API_BASE_URL = 'https://notehub-public.goit.study/api';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcmluYWJvaW5pa0BnbWFpbC5jb20iLCJpYXQiOjE3NDk4Mjk3NTB9.-u0I5eB-CuMGPFTHxiM6oRxJVQt6l2nExoiyTTQpsXo';

export const fetchNotes = async (search: string, page: number) => {
  const params: Record<string, any> = { page };

  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  const response = await axios.get(`${API_BASE_URL}/notes`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('fetchNotes response:', response.data); // <-- лог

  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface NotePayload {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (note: NotePayload) => {
  const response = await axios.post(`${API_BASE_URL}/notes`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


