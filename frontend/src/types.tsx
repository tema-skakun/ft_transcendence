interface blockProps {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	// userdata: React.MutableRefObject<object>;
	userdata: userProps | undefined;
}

export default blockProps;

export interface userProps {
	username: string,
	email: string,
	full_name: string,
	picture_url: string,
}

