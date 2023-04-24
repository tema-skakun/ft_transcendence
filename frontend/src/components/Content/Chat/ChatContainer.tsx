import React from "react";
import {sendMessageActionCreator, updateNewMessageBodyCreator,} from "../../../Redux/chatReducer";
import Chat from "./Chat";

const ChatContainer = (props: any) => {
    let onSendMessageClick = () => {
        props.store.dispatch(sendMessageActionCreator())
    };

    let onMessageChange = (body: any) => {
        let action = updateNewMessageBodyCreator(body);
        props.store.dispatch(action);
    };

    let state: any = props.store.getState();

    return (
        <Chat
            uppdateNewMessageBody={onMessageChange}
            sendMessage={onSendMessageClick}
            chatPage={state.chatPage}
        />)
}

export default ChatContainer;