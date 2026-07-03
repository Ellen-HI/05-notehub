import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import { useEffect, useState } from "react";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../Modal/Modal";

function App() {
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () => fetchNotes(query, page, 12),
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (isSuccess && data?.notes.length === 0) {
      toast.error("No notes found.");
    }
  }, [isSuccess, data]);

  const totalPages = data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Toaster position="top-center" reverseOrder={false} />
        <SearchBox value={query} onChange={debouncedSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={(id) => deleteMutation.mutate(id)}
          onSelect={() => {}}
        />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </Modal>
      )}
    </div>
  );
}
export default App;
