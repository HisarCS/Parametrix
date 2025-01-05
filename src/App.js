import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SplitSelection from "./components/SplitSelection";
import ParametrixView from "./components/ParametrixView";

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/split" element={<SplitSelection />} />
      <Route path="/parametrix" element={<ParametrixView />} />
    </Routes>
  </HashRouter>
);

export default App;
