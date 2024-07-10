import { Route, Routes } from "react-router-dom";

import * as components from "./components";

function App() {
  return (
    <Routes>
      <Route element={<components.AppLayout />}>
        {/* public routes  */}
        <Route index element={<div>Hello</div>} />

        {/* catch-all route*/}
        <Route path="*" element={<div>Not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
