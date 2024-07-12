import { Route, Routes } from "react-router-dom";

import * as components from "./components";

function App() {
  return (
    <Routes>
      <Route element={<components.AppLayout />}>
        {/* public routes  */}
        <Route index element={<div>Hello</div>} />
        <Route path="/auth/login" element={<div>login</div>} />
        <Route element={<components.PersistLogin />}>
          <Route element={<components.RequireAuth />}>
            <Route path="/new-story" element={<div>hehehe</div>} />
          </Route>{" "}
        </Route>
      </Route>
      {/* catch-all route*/}
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
}

export default App;
