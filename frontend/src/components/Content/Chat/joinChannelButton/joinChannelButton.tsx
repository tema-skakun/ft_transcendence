import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import JSCookies from 'js-cookie';

const JoinChannelButton = ({ closeModal, socket }: {closeModal: any, socket: any}) => {
	const [channels, setChannels] = useState<any>([]);
	const [selectedChannelIds, setSelectedChannelIds] = useState<any>([]);

	useEffect(() =>{
		const getChannels = async ()=>{
			try {
				const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/joinchannels`, {
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
	}, [])

	async function handleSubmit(e: any) {
		e.preventDefault();

		closeModal();
	}

	function handleCheckboxChange(channelId: any) {
		setSelectedChannelIds((prevSelectedChannelIds: any) => {
		if (prevSelectedChannelIds.includes(channelId)) {
			return prevSelectedChannelIds.filter((prevId: any) => {
				return channelId !== prevId;
			});
		} else {
			return [...prevSelectedChannelIds, channelId];
		}
		});
	}

	return (
		<>
			<Modal.Header closeButton><Modal.Title>Join channel</Modal.Title></Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
				{channels.map((channel: any) => (
					<Form.Group key={channel.id} controlId={channel.id}>
					<Form.Check
						type="radio"
						value={selectedChannelIds.includes(channel.id)}
						label={channel.name}
						onChange={() => handleCheckboxChange(channel.id)}
					/>
					</Form.Group>
				))}
				<Modal.Footer> <Button type="submit">Join</Button> </Modal.Footer>
				</Form>
			</Modal.Body>
		</>
	);
};

export default JoinChannelButton;