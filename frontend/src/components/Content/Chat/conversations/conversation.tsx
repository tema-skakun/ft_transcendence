
import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css'

export default function Conversation({ channel, currentUser, currentChannel}: {currentChannel: any, channel: any, currentUser: any}) {
	const [user, setUser] = useState<any>(null);
	
	useEffect(() => {
		const getUser = async () => {
			if (channel.isDM) {
				try {
					const res = await axios(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/channelUsers/` + channel.id);
					const friend = res.data.find((m: any) => m.intra_id !== currentUser.intra_id);
					setUser(friend);
				}catch(err) {
					console.log('ERROR in conversation: ' + err);
				}
			}
		};
		getUser();
	}, [channel, currentUser])

	return (
		<div className={channel?.id === currentChannel?.id ? 'active' : 'conversation' }>
			<img className='conversationImg' 
			src={
				user?.picture_url
					? user.picture_url
					: 'https://msf-theeltal.de/wp-content/uploads/2018/04/no-avatar.jpg'
			} 
			alt=''
			/>
			<span className='conversationName'>{user?.username ? user.username : channel.name}</span>
		</div>
	)
}