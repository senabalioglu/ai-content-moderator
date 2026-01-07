import "../LoginInput/LoginInput.css"

const LoginInput = ({userName, setUserName, handleLogin}) => {
    return(
        <div className="input-container" >
            <input 
            className="username-input"
            type="text"
            placeholder="Enter username..."
            value={userName}
            onChange={setUserName}
            />
            <button className="login-button" onClick={handleLogin} > Login </button>
        </div>
    )
}

export default LoginInput;