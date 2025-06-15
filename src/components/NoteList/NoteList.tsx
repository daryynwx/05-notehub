import React from 'react';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation: UseMutationResult<void, Error, number> = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] }); 
    },
  });

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <h3>{note.title}</h3>
          <button
  onClick={() => deleteMutation.mutate(note.id)}
  disabled={deleteMutation.status === 'pending'}
>
  {deleteMutation.status === 'pending' ? 'Deleting...' : 'Delete'}
</button>

        </li>
      ))}
    </ul>
  );
};

export default NoteList;
