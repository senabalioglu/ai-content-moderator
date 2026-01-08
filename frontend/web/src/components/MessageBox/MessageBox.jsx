import "../MessageBox/MessageBox.css";

const MessageBox = ({ messageData, isOwnMessage, isMessageBlocked }) => {
  return (
    <>
      {isMessageBlocked ? (
        <div className={`message-box ${isOwnMessage ? "own" : "other"}`}>
          <h3 className={`message-text ${isOwnMessage ? "own" : "other"}`}>
            {" "}
            {messageData.userName}{" "}
          </h3>
          <div>
            <p style={{ color: `${isOwnMessage ? "aliceblue" : "black"}`, padding: 5 }}>Message is blocked</p>
          </div>
        </div>
      ) : (
        <div className={`message-box ${isOwnMessage ? "own" : "other"}`}>
          <h3 className={`message-text ${isOwnMessage ? "own" : "other"}`}>
            {" "}
            {messageData.userName}{" "}
          </h3>
          <p className={`message-text ${isOwnMessage ? "own" : "other"}`}>
            {" "}
            {messageData.content}{" "}
          </p>
        </div>
      )}
    </>
  );
};

export default MessageBox;
