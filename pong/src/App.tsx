import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';

// interface Props {
//     state: any;
//     addMessage: any;
//     updateNewMessageText: any;
// }

function App(props: any) {
    return (
        <div className="App">
            <Navbar />
            <Content
                state={props.state}
                addMessage={props.addMessage}
                updateNewMessageText={props.updateNewMessageText}
            />
        </div>
    );
}

export default App;
