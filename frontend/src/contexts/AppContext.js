"use client";

import { createContext, useContext, useState } from "react";
import { initialBooks } from "@/data/mock-data";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState(initialBooks);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddBook = (newBook) => {
    const book = {
      ...newBook,
      id: Date.now().toString()
    };
    setBooks(prev => [...prev, book]);
    return book;
  };

  const handleEditBook = (id, updatedBook) => {
    setBooks(prev => 
      prev.map(book => 
        book.id === id ? { ...book, ...updatedBook } : book
      )
    );
  };

  const handleDeleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        books,
        handleLogin,
        handleLogout,
        handleAddBook,
        handleEditBook,
        handleDeleteBook,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
