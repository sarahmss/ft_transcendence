export const reducer = (state : {[key: string]: any},
						newState : {[key: string]: any}) => {
	return {...state, ...newState};
}
