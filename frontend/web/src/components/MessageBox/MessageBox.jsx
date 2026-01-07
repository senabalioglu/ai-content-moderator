import "../MessageBox/MessageBox.css"

const MessageBox = ({messageData, isOwnMessage}) => {

    return(
        <>
        <div className={`message-box ${isOwnMessage ? "own" : "other"}`} >
            <h3 className={`message-text ${isOwnMessage ? "own" : "other"}`} > {messageData.userName} </h3>
            <p className={`message-text ${isOwnMessage ? "own" : "other"}`} > {messageData.content} </p>
        </div>
        </>
    )
}

export default MessageBox;