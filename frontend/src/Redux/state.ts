const UPDATE_NEW_MESSAGE_BODY = 'UPDATE-NEW-MESSAGE-BODY';
const SEND_MESSAGE = 'SEND-MESSAGE';



let store: any = {
    _state: {
        profilePage: {
            user: {
                id: 1,
                login: "fdarkhaw",
                password: "Qwerty_12345",
                name: "Darkhawk",
                userAvatar: "https://playcontestofchampions.com/wp-content/uploads/2021/11/champion-darkhawk.jpg",
                userFriends: [],
                userStatus: {1: "online", 2: "offline", 3: "in a waiting room", 4: "in a game"},
                statWins: 0,
                statLosses: 0,
                ladderLevel: 0,//for example: for winning +10ex, for losing -5ex
                userAchievements: [],

            },

            allAchievements: {
                unstoppable: "10 wins in a row",
                invincible: "5 wins in a row"
            }
        },
        chatPage: {
            chatType: {1: "public", 2: "private", 3: "protected"},
            chat: [
                {
                    id: 1,
                    name: 'Linus',
                    avatarLink: 'https://i.pinimg.com/originals/c1/f2/5f/c1f25f71f7dbc8413da545076118e054.jpg'
                },
                {
                    id: 2,
                    name: 'Boris',
                    avatarLink: 'https://99px.ru/sstorage/1/2015/11/image_11111151003517187270.jpg'
                },
                {
                    id: 3,
                    name: 'Paul',
                    avatarLink: 'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/224480/P5jfvm3cJ7RzrPVLeo4kHA.jpg'
                },
                {
                    id: 4,
                    name: 'Evgeniy',
                    avatarLink: 'https://cs14.pikabu.ru/post_img/2022/05/23/5/1653287994258846794.jpg'
                },
                {id: 5, name: 'Anton', avatarLink: 'https://bipbap.ru/wp-content/uploads/2017/11/5_ja7.jpg'},
                {
                    id: 6,
                    name: 'Alexander',
                    avatarLink: 'https://proprikol.ru/wp-content/uploads/2019/08/kartinki-volk-iz-nu-pogodi-19.jpg'
                },
                {id: 7, name: 'Pablo', avatarLink: 'https://souzmult.ru/api/images/character-5d75efa0dfe23.svg'}
            ],
            messages: [
                {id: 1, message: 'Hi'},
                {id: 2, message: 'How are you?'},
                {id: 3, message: 'Yo'},
                {id: 4, message: 'Wazzzaaa?'},
                {id: 5, message: 'go dota'},
                {id: 6, message: 'Whatever'},
                {id: 7, message: 'bb gl'}
            ],
            newMessageBody: '',
        },
        gamePage: {
            friends: [
                {id: 1, name: 'Flash', avatarLink: 'https://avatarfiles.alphacoders.com/257/257694.jpg'},
                {
                    id: 2,
                    name: 'Batman',
                    avatarLink: 'https://i.pinimg.com/474x/d7/d7/0e/d7d70e9056d2b0d46463f4ca5e1ea67b.jpg'
                },
                {
                    id: 3,
                    name: 'Spider-Man',
                    avatarLink: 'https://assets.reedpopcdn.com/spider-man-walkthrough-guide-5014-1537780065472.jpg/BROK/thumbnail/1200x1200/quality/100/spider-man-walkthrough-guide-5014-1537780065472.jpg'
                },
                {id: 4, name: 'Wonder Woman', avatarLink: 'https://avatarfiles.alphacoders.com/116/116579.jpg'},
            ]
        }
    },
    _callSubscriber(state: any) {
        console.log('state changed');
    },
    _sendMessage(){
        let newMessage = {
            id: 8,
            message: this._state.chatPage.newMessageBody
        };
        this._state.chatPage.newMessageBody = '';
        this._state.chatPage.messages.push(newMessage);
        this._callSubscriber(this._state);
    },
    _updateNewMessageBody(body:any) {
        this._state.chatPage.newMessageBody = body;
        this._callSubscriber(this._state);
    },

    getState() {
        return (this._state);
    },
    subscribe(observer: any) {
        this._callSubscriber = observer;//observer pattern
    },

    dispatch(action:any){
        if (action.type === SEND_MESSAGE) { this._sendMessage() }
        else if (action.type === UPDATE_NEW_MESSAGE_BODY) { this._updateNewMessageBody(action.body) }
    }
}

export const sendMessageActionCreator = () => ( {type: SEND_MESSAGE} )

export const updateNewMessageBodyCreator = (text:any) =>
    ( {type: UPDATE_NEW_MESSAGE_BODY, body: text} );

export default store;
