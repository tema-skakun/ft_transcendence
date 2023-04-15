import style from './Chat.module.css'
import React from "react";
import ChatItem from "./ChatItem/ChatItem";
import Message from "./Message/Message";

const Chat = (props: any) => {

    let dialogsElements = props.chatPage.chat.map((d: any) =>
        <ChatItem
            name={d.name}
            id={d.id}
            ava={d.avatarLink}
        />);
    let messagesElements = props.chatPage.messages.map((m: any) => <Message message={m.message}/>);

    let sendMessage = () => {
        props.addMessage();
    };

    const newMessageElement = React.createRef<HTMLTextAreaElement>();

    let onMessageChange = () => {
        let text = newMessageElement.current?.value;
        props.updateNewMessageText(text);
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
                <textarea
                    onChange={onMessageChange}
                    ref={newMessageElement}
                    value={props.chatPage.newMessageText}
                />
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