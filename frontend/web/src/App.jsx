import { useEffect, useState } from "react";
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  
   useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("currentUser");

    if (storedLogin === "true" && storedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
    <Routes>
      <Route 
        path="/"
        element={
          isLoggedIn ? (
            <Home currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Navigate to={"/login"} replace />
          )
        }
      />
      <Route 
        path="/login"
        element={
          <Login 
            setIsLoggedIn={setIsLoggedIn}
            setCurrentUser={setCurrentUser}
          />
        }
      />
    </Routes>
  );
}

export default App;
