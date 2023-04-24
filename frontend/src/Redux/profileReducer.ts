let initialState:any = {
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
}

const profileReducer = (state:any = initialState, action: any) => {
    return state;
}

export default profileReducer;
