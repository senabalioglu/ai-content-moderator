import "../MessageBox/MessageBox.css";

const MessageBox = ({
  messageData,
  isOwnMessage,
  isMessageBlocked,
  rawResult,
}) => {
  const parsedResult = JSON.parse(rawResult);

  const blockedCategories = Object.entries(parsedResult)
    .filter(([category, data]) => {
      const dangerousLabels = ["toxic", "hate", "nsfw", "spam", "LABEL_1"];
      return dangerousLabels.includes(data.label) && data.score > 0.5;
    })
    .map(([category]) => category);

  return (
    <>
      {isMessageBlocked ? (
        <div className={`message-box ${isOwnMessage ? "own" : "other"}`}>
          <h3 className={`message-text ${isOwnMessage ? "own" : "other"}`}>
            {" "}
            {messageData.userName}{" "}
          </h3>
          <div>
            <p
              style={{
                color: `${isOwnMessage ? "aliceblue" : "black"}`,
              }}
            >
              Message is blocked due to it's content of
            </p>
            <h4 style={{ color: "red" }}> {blockedCategories.join(", ")} </h4>
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
