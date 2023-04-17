import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';

function App(props: any) {
    return (
        <div className="App">
            <Navbar />
            <Content state={ props.state } dispatch={ props.dispatch }/>
        </div>
    );
}

export default App;
