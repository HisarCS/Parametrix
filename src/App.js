import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SplitSelection from "./components/SplitSelection";
import ParametrixView from "./components/ParametrixView";
import Select from "./components/Select.js";
import Lvl1 from "./components/lvl1.js";
import Lvl2 from "./components/lvl2.js";
import Lvl3 from "./components/lvl3.js";
import Lvl4 from "./components/lvl4.js";
import Lvl5 from "./components/lvl5.js";
import Lvl6 from "./components/lvl6.js";
import Lvl7 from "./components/lvl7.js";
import Wildcard from "./components/Wildcard.js";



const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/split" element={<SplitSelection />} />
      <Route path="/parametrix" element={<ParametrixView />} />
      <Route path="/levelselection" element={<Select />} />
      <Route path="/lvl1" element={<Lvl1 />} />
      <Route path="/lvl2" element={<Lvl2 />} />
      <Route path="/lvl3" element={<Lvl3 />} />
      <Route path="/lvl4" element={<Lvl4 />} />
      <Route path="/lvl5" element={<Lvl5 />} />
      <Route path="/lvl6" element={<Lvl6 />} />
      <Route path="/lvl7" element={<Lvl7 />} />
      <Route path="/w" element={<Wildcard />} />
    </Routes>
  </HashRouter>
);

export default App;
