import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import store from "./Redux/state";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
let renderEntireTree = (state:any) => {
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App
                    state={state}
                    addMessage={store.addMessage.bind(store)}
                    updateNewMessageText={store.updateNewMessageText.bind(store)}
                />
            </BrowserRouter>
        </React.StrictMode>
    );
}

renderEntireTree(store.getState());

store.subscribe(renderEntireTree);

reportWebVitals();
