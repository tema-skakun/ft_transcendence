import { useEffect } from "react";

export const useDocument = (_event, callback) => {
	useEffect(() => {
		document.addEventListener(_event, callback)
		return ( () => {
			document.removeEventListener(_event, callback);
		})
	}, [_event, callback]);
}
