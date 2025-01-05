import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SplitSelection from "./components/SplitSelection";
import ParametrixView from "./components/ParametrixView";
import Select from "./components/Select.js";


const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/split" element={<SplitSelection />} />
      <Route path="/parametrix" element={<ParametrixView />} />
      <Route path="/levelselection" element={<Select />} />
    </Routes>
  </HashRouter>
);

export default App;
