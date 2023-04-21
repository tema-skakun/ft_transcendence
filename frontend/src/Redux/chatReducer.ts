const UPDATE_NEW_MESSAGE_BODY = 'UPDATE-NEW-MESSAGE-BODY';
const SEND_MESSAGE = 'SEND-MESSAGE';

const chatReducer = (state: any, action: any) => {
    switch (action.type) {
        case SEND_MESSAGE:
            let newMessage = {
                id: 8,
                message: state.newMessageBody
            };
            state.newMessageBody = '';
            state.messages.push(newMessage);
            return state;
        case UPDATE_NEW_MESSAGE_BODY :
            state.newMessageBody = action.body;
            return state;
        default :
            return state;
    }
}

export const sendMessageActionCreator = () => ( {type: SEND_MESSAGE} )
export const updateNewMessageBodyCreator = (text:any) =>
    ( {type: UPDATE_NEW_MESSAGE_BODY, body: text} );

export default chatReducer;
