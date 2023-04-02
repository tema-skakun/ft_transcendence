import { useEffect } from 'react';

export function useKeydown(handler: (this: Document, ev: KeyboardEvent) => void ) {
useEffect(() => {
		document.addEventListener('keydown', handler)
	}, [handler])
}

