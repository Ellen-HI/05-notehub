import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import { useState } from "react";
function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () => fetchNotes(query, page, 12),
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });
  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setIsModalOpen(false);
    },
  });
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        <Pagination>totalPages, page, onPageChangets,</Pagination>
          
        
        <button className={css.button}>Create note +</button>
      </header>
      <NoteList
    notes={data.notes}
    onDelete={(id) => mutation.mutate(id)}
    onSelect={...}
/>
    </div>
  );
}
