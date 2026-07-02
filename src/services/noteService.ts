import axios from "axios";
import type { Note } from "../types/note.ts";
interface FetchNotesResponse {
  notes: Note[];
  page: number;
  per_page: number;
  totalPages: number;
  totalItems: number;
}
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
export const fetchNotes = async (
  query: string,
  page: number,
  per_page: number,
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: {
        query,
        page,
        per_page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    note,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
