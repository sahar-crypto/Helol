import "../css/Chat.css";

function Chat() {
    return (
        <div className="chat-box">
            <div className="prompt">ما هي شكوتك؟</div>

            <div className="chat-input">
                <span className="icon-send">
                    <img src="/add.png" alt="Send Icon"/>
                </span>
                <input type="text" placeholder="أكتب شكوتك هنا"/>
                <div className="icons">
                    <span className="icon-image">
                        <img src="/add_photo.png" alt="Image Icon"/>
                    </span>
                    <span className="icon-mic">
                        <img src="/voice.png" alt="Mic Icon"/>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Chat;
