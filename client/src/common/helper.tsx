export const reducer = (state : {[key: string]: any},
						newState : {[key: string]: any}) => {
	return {...state, ...newState};
}
export const getToken = () => {
	if (document.cookie.indexOf('Token=') === -1) {
	  return 'error';
	}

	const splitted = document.cookie.split('Token=');
	if (!splitted || splitted.length <= 1) {
	  return 'error';
	}

	const token = splitted[1];
	return token;
	};

