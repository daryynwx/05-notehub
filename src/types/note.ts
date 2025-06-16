export interface Note {
  id: string;
  title: string;
  content?: string;
  tag: 'todo' | 'work' | 'personal' | 'meeting' | 'shopping';
  createdAt: string;
}

export type Tag = 'Todo' | 'work' | 'personal' | 'meeting' | 'shopping';

export interface NewNote {
  title: string;
  content: string;
  tag: Tag;
}


export interface NotesResponse {
  notes: Note[];
  total: number;
}
