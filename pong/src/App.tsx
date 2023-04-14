import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';

interface Props {
    state: any;
    addMessage: any;
}

function App(props: Props) {
    return (
        <div className="App">
            <Navbar />
            <Content state={props.state} addMessage={props.addMessage}/>
        </div>
    );
}

export default App;
