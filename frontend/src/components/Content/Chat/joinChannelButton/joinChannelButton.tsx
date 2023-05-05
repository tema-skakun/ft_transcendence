import axios from 'axios';

interface JoinChannelButtonProps {
  channels: any[];
  setChannels: React.Dispatch<React.SetStateAction<any[]>>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentChannel: React.Dispatch<React.SetStateAction<any>>;
  userdata: any;
}

const JoinChannelButton = ({ closeModal }: {closeModal: any}) => {
  const handleJoinChannel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
	console.log('handle submit in join channel button');
    // try {
    //   const res = await axios.post('http://localhost:6969/chat/join', {
    //     userId: userdata.intra_id,
    //     channelId: 'channelId', // replace with the actual channel id
    //   });
    //   setChannels([...channels, res.data.channel]);
    //   setCurrentChannel(res.data.channel);
    //   setMessages([]);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <button className="joinChannelButton" onClick={handleJoinChannel}>
      Join Channel
    </button>
  );
};

export default JoinChannelButton;