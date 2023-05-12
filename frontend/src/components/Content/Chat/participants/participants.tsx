import { useCallback, useEffect, useState } from 'react'
import './participants.css'
import axios from 'axios';
import { Button, Dropdown } from 'react-bootstrap';
import { BsGearFill } from 'react-icons/bs';
import ParticipantsDropdown from './Dropdown/Dropdown';
import JSCookies from 'js-cookie';

export default function Participants({ channel, currentUser, socket}: {channel: any, currentUser: any, socket: any}) {
	const[members, setMembers] = useState<any>([])
	const [show, setShow] = useState(false);

	useEffect(() => {
			const getChannelUsers = async () => {
				if (channel) {
					try {
						const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/channelUsers/` + channel.id, {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
							}
						});
						const friend = res.data.find((m: any) => m.intra_id === currentUser.intra_id);
						const friends = res.data.filter((obj: any) => obj !== friend);
						setMembers(friends);
					}catch(err) {
						console.log('ERROR in conversation: ' + err);
					}
				}
			};
			getChannelUsers();
			socket?.on('updateMembers', (data: any) =>{
				getChannelUsers();
			});
		
	}, [channel, currentUser])

	function handleClick (e: any) {
		e.preventDefault();
		console.log('click');
	}

	const hideDropdown = useCallback(() => setShow(false), []);

	function closeModal() {
		setShow(false)
	}

	return (
		<div className='chatParticipants' >
			{members.map((o: any) => (
				<div key={o.intra_id} className='chatOnlineParticipants'>
					<div className="chatParticipantsImgContainer">
						<img
							className="chatParticipantsImg" 
							src={o.picture_url} 
							alt=''
						/>
					</div>
					<span className='chatParticipantsName'>{o.username}</span>
					<div>
						< ParticipantsDropdown userProfile={o} currentUser={currentUser} socket={socket}/>
					</div>
				</div>
			))}
		</div>
	
	)
}
  