import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { FavoritesPage } from "./pages/FavoritesPage";

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/favorites" element={<FavoritesPage />}></Route>
    </Routes>
  </BrowserRouter>
);
