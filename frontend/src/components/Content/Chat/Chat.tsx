import style from './Chat.module.css'
import React, { useEffect, useRef, useState } from "react";
import {addMessageActionCreator, updateNewMessageTextActionCreator} from "../../../Redux/state";
import './Chat.css'
import Conversation from './conversations/conversation';
import Message from './message/message';
import Participants from './participants/participants';
import axios from 'axios';
import { useRouteLoaderData } from 'react-router-dom';
import { io } from 'socket.io-client'

const Chat = (props: any) => {
	const [channels, setChannels] = useState([]);
	const [currentChannel, setCurrentChannel] = useState<any>(null);
	const [messages, setMessages] = useState<any>([]);
	const [newMessage, setNewMessage] = useState('');
	const scrollRef = useRef<any>();
	const socket = useRef<any>();

	useEffect(() => {
		socket.current = io("ws://localhost:6969/chat");
	}, []);

	useEffect(() =>{
		const getChannels = async ()=>{
			try {
				const res = await axios.get("http://localhost:6969/chat/"+props.userdata.intra_id)
				setChannels(res.data);
			} catch(err) {
				console.log(err);
			}
		}
		getChannels();
	}, [props.userdata.intra_id])

	useEffect(() =>{
		if (currentChannel) {
			const getMessages =async () => {
				try {
					const res = await axios.get("http://localhost:6969/messages/"+currentChannel?.id);
					setMessages(res.data);
				} catch(err) {
					console.log(err);
				}
			}
			getMessages();
		}
	},[currentChannel]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const message = {
			senderId: props.userdata.intra_id,
			text: newMessage,
			channelId: currentChannel.id,
		};
		try {
			const res = await axios.post('http://localhost:6969/messages/create', message);
			setMessages([...messages, res.data])
			setNewMessage('');
		}catch(err) {
			console.log(err);
		}
	}

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behavior: "smooth" });
	},[messages])

    return (
        <div className="chat">
            <div className='chatMenu'>
				<div className="chatMenuWrapper">
					<div className='chatMenuButtons' >Maybe buttons</div>
					{channels.map((c: any) => (
						<div key={c.id} onClick={() => setCurrentChannel(c)}>
							<Conversation channel={c} currentUser={props.userdata}/>
						</div>
					))}
				</div>
			</div>
			<div className='chatBox'>
				<div className="chatBoxWrapper">
					{currentChannel ? (
						<>
							<div className="chatBoxTop">
								{messages.map((m: any)=>(
									<div key={m.id} ref={scrollRef}>
										<Message message={m} own={m.sender.intra_id === props.userdata.intra_id} />
									</div>
								))}
							</div>
							<div className="chatBoxBottom">
								<textarea className="chatMessageInput" 
									placeholder='write something...'
									onChange={(e) => setNewMessage(e.target.value)}
									value={newMessage}
								></textarea>
								<button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
							</div>
						</> 
					) : (
						<span className='noConversationText'>Open a conversation</span>
					)}
				</div>
			</div>
			<div className="chatParticipants">
				<div className="chatParticipantsWrapper">
					<Participants />
					<Participants />
					<Participants />
				</div>
			</div>
        </div>
    )
}

export default Chat;