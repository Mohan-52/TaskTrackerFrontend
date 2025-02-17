import Login from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskDetails from "./components/TaskDetails";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tasks from "./components/Tasks";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetails/>
            </ProtectedRoute>
          }
          />
          <Route path="/not-found" element={<NotFound/>}/>
          <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </BrowserRouter>
    
  );
}

export default App;
