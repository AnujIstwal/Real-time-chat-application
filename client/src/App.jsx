import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

function App() {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");

  const onJoin = (username, fullname) => {
    if (!username || !fullname) return;
    setUserName(username);
    setFullName(fullname);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onJoin={onJoin} />} />
        <Route
          path="/dashboard"
          element={<Dashboard fullName={fullName} userName={userName} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
