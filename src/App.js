import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import HomePage from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<Dashboard />} />
 <Route path="/expense" element={ <Expense />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
