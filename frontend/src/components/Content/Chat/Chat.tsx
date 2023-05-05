import { useEffect, useRef, useState } from "react";
import './Chat.css'
import Conversation from './conversations/conversation';
import Message from './Message/Message';
import Participants from './participants/participants';
import axios from 'axios';
import { io } from 'socket.io-client'
import JSCookies from 'js-cookie';
import CreateChannelButton from './createConversationButton/createConversationButton';
import JoinChannelButton from './joinChannelButton/joinChannelButton';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CREATE_KEY = 'create'
const JOIN_KEY = 'join'

const Chat = (props: any) => {
	const [channels, setChannels] = useState([]);
	const [currentChannel, setCurrentChannel] = useState<any>(null);
	const [messages, setMessages] = useState<any>([]);
	const [newMessage, setNewMessage] = useState('');
	const scrollRef = useRef<any>();
	const socket = useRef<any>();
	const [arrivalMessage, setArrivalMessage] = useState<any>(null);
	const [modalOpen, setModalOpen] = useState(false)
	const [activeKey, setActiveKey] = useState(CREATE_KEY)


	useEffect(() => {
		socket.current = io("ws://localhost:6969/chat", {
			query: { accessToken:  JSCookies.get('accessToken')},
		  });
		socket.current.on('getMessage', (data: any) => {
			setArrivalMessage(data);
		});
		return (() => {
			if (!socket.current.disconnected)
			{
				socket.current.disconnect();
			}
		})
	}, []);

	useEffect(() => {
		arrivalMessage && currentChannel && currentChannel.id === arrivalMessage.channel.id &&
		setMessages((prev: any)=> [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChannel])


	useEffect(() =>{
		const getChannels = async ()=>{
			try {
				const res = await axios.get("http://localhost:6969/chat/"+props.userdata.intra_id, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
					}
				})
				setChannels(res.data);
				
			} catch(err) {
				console.log(err);
			}
		}
		getChannels();
		socket.current.on('updateChannels', () => {
			getChannels();
		})
	}, [props.userdata.intra_id])

	useEffect(() =>{
		if (currentChannel) {
			const getMessages =async () => {
				try {
					const res = await axios.get("http://localhost:6969/messages/"+currentChannel?.id, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
						}
					});
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
			const res = await axios.post('http://localhost:6969/messages/create', message, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				}
			});
			setMessages([...messages, res.data])
			socket.current.emit('sendMessage', res.data);
			setNewMessage('');
		}catch(err) {
			console.log(err);
		}
	}

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behavior: "smooth" });
	},[messages])

	function closeModal() {
		setModalOpen(false)
	}

    return (
        <div className="chat">
            <div className='chatMenu'>
				<div className="chatMenuWrapper">
					<div className='chatMenuButtons' style={{ display: 'flex', justifyContent: 'space-between' }} >
						<Button onClick={() => {setActiveKey(CREATE_KEY); setModalOpen(true) } } className="rounded-0" style={{ flex: 1 }}>
							Create
						</Button>
						<Button onClick={() => {setActiveKey(JOIN_KEY); setModalOpen(true) } } className="rounded-0" style={{ flex: 1, marginLeft: '3px' }}>
							Join
						</Button>
					</div>
					{channels.map((c: any) => (
						<div key={c.id} onClick={() => setCurrentChannel(c)}>
							<Conversation currentChannel={currentChannel} channel={c} currentUser={props.userdata}/>
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
					<Participants channel={currentChannel} currentUser={props.userdata}/>
				</div>
			</div>
			<Modal show={modalOpen} onHide={closeModal} backdrop="static" keyboard={false}>
				{activeKey === CREATE_KEY ?
					<CreateChannelButton socket={socket.current} closeModal={closeModal} /> :
					<JoinChannelButton closeModal={closeModal} />
				}
      		</Modal>
        </div>
    )
}

export default Chat;