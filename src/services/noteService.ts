import axios from 'axios';
import type { Note } from '../types/note'; 

const API_BASE_URL = 'https://notehub-public.goit.study/api';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcmluYWJvaW5pa0BnbWFpbC5jb20iLCJpYXQiOjE3NDk4Mjk3NTB9.-u0I5eB-CuMGPFTHxiM6oRxJVQt6l2nExoiyTTQpsXo';


export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}


export const fetchNotes = async (
  search: string,
  page: number
): Promise<NotesResponse> => {
  const params: Record<string, any> = { page };

  if (search.trim() !== '') {
    params.search = search.trim();
  }

  const response = await axios.get<NotesResponse>(`${API_BASE_URL}/notes`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axios.delete<Note>(`${API_BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response = await axios.post<Note>(`${API_BASE_URL}/notes`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
