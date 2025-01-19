import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { FavoritesPage } from "./pages/FavoriteCatsPage";

export const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/favorites" element={<FavoritesPage />}></Route>
    </Routes>
  </HashRouter>
);
