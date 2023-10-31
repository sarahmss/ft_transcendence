import React from 'react';

const Pong = () => {
	const players = {
		player1:{
			name: 'Player 1'
		},
		player2: {
			name: 'Player 2'
		}
	};

	return (
		<div>
			{Object.keys(players)
				.map((key) => (
				<div>{players[key].name}</div>
				))
			}
		</div>
	);
};

export default Pong;

