
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import store from "./Redux/state";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
let renderEntireTree = (state:any) => {
    root.render(
            <BrowserRouter>
                <App state={ state } dispatch={ store.dispatch.bind(store) }/>
            </BrowserRouter>
    );
}
{/* <React.StrictMode>
</React.StrictMode> */}
renderEntireTree(store.getState());

store.subscribe(renderEntireTree);

reportWebVitals();
