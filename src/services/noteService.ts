import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface NotesResponse {
  notes: Note[];
  total: number;
}

export const fetchNotes = async ({
  search = '',
  page = 1,
  limit = 10,
}: FetchNotesParams = {}): Promise<NotesResponse> => {
  const { data } = await axios.get('/api/notes', {
    params: { q: search, _page: page, _limit: limit },
  });
  // предполагаем, что API возвращает { notes: Note[], total: number }
  return {
    notes: data.notes,
    total: data.total,
  };
};

export const deleteNote = async (id: number): Promise<void> => {
  await axios.delete(`/api/notes/${id}`);
};

