import { useEffect, useState } from 'react'
import './participants.css'
import axios from 'axios';

export default function Participants({ channel, currentUser}: {channel: any, currentUser: any}) {
	const[members, setMembers] = useState<any>([])

	useEffect(() => {
			const getChannelUsers = async () => {
				if (channel) {
					try {
						const res = await axios('http://localhost:6969/chat/channelUsers/' + channel.id);
						const friend = res.data.find((m: any) => m.intra_id === currentUser.intra_id);
						const friends = res.data.filter((obj: any) => obj !== friend);
						setMembers(friends);
					}catch(err) {
						console.log('ERROR in conversation: ' + err);
					}
				}
			};
			getChannelUsers();
		
	}, [channel, currentUser])



	return (
		<div className='chatParticipants'>
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
				</div>
			))}
		</div>
	)
}
  