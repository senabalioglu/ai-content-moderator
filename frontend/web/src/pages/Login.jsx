import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../components/LoginInput/LoginInput";

function Login({ setIsLoggedIn, setCurrentUser }) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userName.trim()) {
      alert("Lütfen bir kullanıcı adı girin!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/Users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userName),
      });

      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

      const data = await res.json();
      console.log("Giriş yapan kullanıcı:", data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(data));
      setCurrentUser(data);
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      console.error("Login hatası:", err);
    }
  };

  return (
    <div>
      <LoginInput
        userName={userName}
        setUserName={(e) => setUserName(e.target.value)}
        handleLogin={handleLogin}
      />
    </div>
  );
}

export default Login;
