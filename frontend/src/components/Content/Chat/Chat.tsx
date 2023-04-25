import style from './Chat.module.css'
import React from "react";
import ChatItem from "./ChatItem/ChatItem";
import Message from "./Message/Message";

const Chat = (props: any) => {
    let dialogsElements = props.chatPage.chat.map((d: any) => <ChatItem name={d.name} key={d.id} id={d.id} ava={d.avatarLink}/>);
    let messagesElements = props.chatPage.messages.map((m: any) => <Message message={m.message} key={m.id}/>);

    let onSendMessageClick = () => {
        props.sendMessage();
    };

    const newMessageElement = React.createRef<HTMLTextAreaElement>();

    let onMessageChange = () => {
        let body = newMessageElement.current?.value;
        props.updateNewMessageBody(body);
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
                    placeholder='Enter your message'
                    onChange={onMessageChange}
                    ref={newMessageElement}
                    value={props.chatPage.newMessageBody}
                />
            </div>
            <div className={style.button}>
                <button onClick={onSendMessageClick}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat;