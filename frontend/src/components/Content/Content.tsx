import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Game from "./Game/Game";
import ChatContainer from "./Chat/ChatContainer";
import ProfileContainer from "./Profile/ProfileContainer";
import MemeOverlay from "./Game/components/memeOverlay";

const Content = () => {

    return (
        <div className={style.content}>
            <Routes>
                <Route path='/profile' element={<ProfileContainer/>}/>
                <Route path='/chat' element={<ChatContainer/>}/>
                <Route path='/game' element={<Game/>}/>
				<Route path='/meme' element={<MemeOverlay memeUrl='/pug-dance.gif' showMeme={true} />}/>
            </Routes>
        </div>
    )
}

export default Content;