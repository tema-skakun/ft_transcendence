import style from './Chat.module.css'
import React from "react";
import ChatItem from "./ChatItem/ChatItem";
import Message from "./Message/Message";

const Chat = (props: any) => {

    let dialogsElements = props.state.chat.map( (d:any) =>
        <ChatItem
            name={d.name}
            id={d.id}
            ava={d.avatarLink}
        />);
    let messagesElements = props.state.messages.map( (m:any) => <Message message={m.message}/>);

    const newMessageElement = React.createRef<HTMLTextAreaElement>();

    let sendMessage = () => {
        let text = newMessageElement.current?.value;
        props.addMessage(text);
    };

    return (
        <div className={style.chat}>
            <div className={style.chatItems}>
                {dialogsElements}
            </div>
            <div className={style.messages}>
                {messagesElements}
            </div>
            <div className={style.textarea}>
                <textarea ref={newMessageElement}></textarea>
            </div>
            <div className={style.button}>
                <button onClick={sendMessage}>
                    send
                </button>
            </div>
        </div>
    )
}

export default Chat;