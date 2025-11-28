import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import HomePage from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 <Route path="/expense" element={<PrivateRoute>  <Expense /></PrivateRoute> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
