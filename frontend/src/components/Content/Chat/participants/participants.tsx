import './participants.css'

export default function Participants() {
	return (
		<div className='chatParticipants'>
			<div className='chatOnlineParticipants'>
				<div className="chatParticipantsImgContainer">
					<img
						className="chatParticipantsImg" 
						src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/2560px-Cat_August_2010-4.jpg'  
						alt=''
					/>
					<div className='chatParticipantsBadge'></div>
				</div>
				<span className='chatParticipantsName'>John Doe</span>
			</div>
		</div>
	)
}
  