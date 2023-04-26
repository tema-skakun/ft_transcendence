const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';

let initialState: any = {
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
        userAchievements: []
    },
    users: [
        {
            id: 1,
            name: 'Linus',
            avatarLink: 'https://i.pinimg.com/originals/c1/f2/5f/c1f25f71f7dbc8413da545076118e054.jpg',
            followed: true
        },
        {
            id: 2,
            name: 'Boris',
            avatarLink: 'https://99px.ru/sstorage/1/2015/11/image_11111151003517187270.jpg',
            followed: false
        },
        {
            id: 3,
            name: 'Paul',
            avatarLink: 'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/224480/P5jfvm3cJ7RzrPVLeo4kHA.jpg',
            followed: false
        },
        {
            id: 4,
            name: 'Evgeniy',
            avatarLink: 'https://cs14.pikabu.ru/post_img/2022/05/23/5/1653287994258846794.jpg',
            followed: false
        },
        {
            id: 5,
            name: 'Anton',
            avatarLink: 'https://bipbap.ru/wp-content/uploads/2017/11/5_ja7.jpg',
            followed: false
        },
        {
            id: 6,
            name: 'Alexander',
            avatarLink: 'https://proprikol.ru/wp-content/uploads/2019/08/kartinki-volk-iz-nu-pogodi-19.jpg',
            followed: false
        },
        {
            id: 7,
            name: 'Pablo',
            avatarLink: 'https://souzmult.ru/api/images/character-5d75efa0dfe23.svg',
            followed: false
        }
    ],
    allAchievements: {
        unstoppable: "10 wins in a row",
        invincible: "5 wins in a row"
    }
}


const profileReducer = (state: any = initialState, action: any) => {

    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                users: state.users.map((u: any) => {
                    if (u.id === action.userId) {
                        return {...u, followed: true}
                    }
                    return u;
                })
            }
        case UNFOLLOW:
            return {
                ...state,
                users: state.users.map((u: any) => {
                    if (u.id === action.userId) {
                        return {...u, followed: false}
                    }
                    return u;
                })
            }
        default:
            return state;
    }

}

export const followAC = (userId: any) => ({type: FOLLOW, userId})

export const unfollowAC = (userId: any) => ({type: UNFOLLOW, userId})


export default profileReducer;
