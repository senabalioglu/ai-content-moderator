import { useEffect, useState } from "react";
import MessageBox from "../components/MessageBox/MessageBox";
import MessageInput from "../components/MessageInput/MessageInput";

function Home({ currentUser }) {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      fetch(`${apiUrl}/Messages/all`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text) => {
    const newMessage = {
      userId: currentUser.id,
      content: text,
    };

    try {
      const res = await fetch(`${apiUrl}/Messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Mesaj gönderilemedi!");

      const savedMessage = await res.json();

      setData((prev) => [...prev, savedMessage]);
    } catch (err) {
      console.error("Gönderim hatası:", err);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 style={{ color: "aliceblue" }}>
        {" "}
        User Logged In, Welcome {currentUser?.userName} 😊{" "}
      </h1>
      <div className="container">
        {data.map((x) => (
          <MessageBox
            key={x.id}
            messageData={x}
            isOwnMessage={x.userId === currentUser.id}
            isMessageBlocked={x.isBlocked}
          />
        ))}
      </div>
      <MessageInput
        onSend={handleSendMessage}
      />
    </div>
  );
}

export default Home;
