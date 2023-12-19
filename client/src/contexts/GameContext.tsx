import React, { useEffect, useReducer, createContext, FC } from "react";
import { Provider, useState } from "react";
import socketClient from 'socket.io-client';
import AuthService from "../services/auth.service";
import { string } from "yup";
interface Player {
	name: string;
	room?: string;
	id?: string;
	state?: string;
	customizations?: any;
	disconnected?: any;
	timerId?: any;
}

interface Room {
	name: string;
	player1?: string;
	player2?: string;
	spectators?: Record<string, any>;
}

interface Match {
	status?: string;
	score1?: number;
	score2?: number;
	gameConfig?: any;
	player1?: any;
	player2?: any;
	ball?: any;
	message?: string;
	accelerated?: boolean;
}

interface State {
  isConnected: boolean;
  players: Record<string, Player>;
  current_player: Player;
  current_room: Room;
  rooms: Record<string, Room>;
  messages: string[];
  match: Match;
  in_waiting: number;
}

type ActionType =
  | { type: 'CONNECTED'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'MESSAGE'; payload: string }
  | { type: 'ROOMS'; payload: Record<string, Room> }
  | { type: 'ROOM'; payload: string }
  | { type: 'PLAYERS'; payload: Record<string, Player> }
  | { type: 'PLAYER'; payload: Player }
  | { type: 'MATCH'; payload: Match }
  | { type: 'WAITING_QUEUE'; payload: number };

const socket = socketClient('http://localhost:4000/game', {
  autoConnect: false,
});

const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        isConnected: state.isConnected,
      };
    case 'MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'ROOMS':
      return {
        ...state,
        rooms: action.payload,
      };
    case 'ROOM':
      return {
        ...state,
        current_room: state.rooms[state.players[action.payload].room!],
      };
    case 'PLAYERS':
      return {
        ...state,
        players: action.payload,
      };
    case 'PLAYER':
      return {
        ...state,
        current_player: action.payload,
      };
    case 'MATCH':
      return {
        ...state,
        match: action.payload,
      };
    case 'WAITING_QUEUE':
      return {
        ...state,
        in_waiting: action.payload,
      };
    default:
      return state;
  }
};

const initialState: State = {
  isConnected: false,
  players: {},
  current_player: { name: '' },
  current_room: { name: '' },
  rooms: {},
  messages: [],
  match: {},
  in_waiting: 0,
};

const GameContext = createContext<State | undefined>(undefined);

const GameProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
		const storedPlayer = AuthService.getCurrentUser();
		// if (!storedPlayer){
		// 	setRedirect("/home");
		// }
		if (storedPlayer !== null) {
			socket.emit('reconnect', storedPlayer);
		}
		socket.emit('login', storedPlayer.userName);
		dispatch({ type: 'CONNECTED', payload: true });
	});

	socket.on('disconnect', () => {
		dispatch({ type: 'CONNECTED', payload: false });
	});

	socket.on('PlayersRefresh', (players) => {
		const player = players[socket.id];
		if (player)
		{
			const storedPlayer = AuthService.getCurrentUser();
			// if (!storedPlayer){
			// 	setRedirect("/home");
			// }
			localStorage.setItem(storedPlayer.userId, JSON.stringify(player));
			dispatch({type: 'PLAYER', payload: players[socket.id]});
		}
		else {
			dispatch({type: 'RESET_STATE'});
		}
		dispatch({type: 'PLAYERS', payload: players});
	});
	socket.on('ReceiveMessage', (receiveMessage) => {
		dispatch({type: 'MESSAGE', payload: receiveMessage });
	});
	socket.on('RoomsRefresh', (rooms) => {
		dispatch({type: 'ROOMS', payload: rooms});
		dispatch({type: 'ROOM', payload: socket.id});
	});
	socket.on('MatchRefresh', (match) => {
		dispatch({type: 'MATCH', payload: match});
	});

	socket.on('WaitingRefresh', (waitingLength) => {
		dispatch({type: 'WAITING_QUEUE', payload: waitingLength});
	});

	socket.on('RemoveMatch', () => {
		dispatch({type: 'MATCH', payload: {}});
	})

	socket.open();
  }, []);

  return (
    <GameContext.Provider value={state}>
      {props.children}
    </GameContext.Provider>
  );
};

// Restante do código...

const sendMessage = (message: string) => {
	socket.emit('SendMessage', message);
  };

  const exitQueue = () => {
	socket.emit('exitQueue');
  };

  const addOnQueue = () => {
	socket.emit('addOnQueue');
  };

  const execMatch = () => {
	socket.emit('execMatch');
  };

  const login = (name: string) => {
	socket.emit('login', name);
  };

  const customizeAndPlay = (customChoices: any) => {
	socket.emit('customizeAndPlay', customChoices);
  };

  const createRoom = () => {
	socket.emit('createRoom');
  };

  const leaveRoom = () => {
	socket.emit('leaveRoom');
  };

  const joinRoom = (roomId: string) => {
	socket.emit('joinRoom', roomId);
  };

  const gameLoaded = () => {
	socket.emit('gameLoaded');
  };

  const enterSpectator = (roomId: string) => {
	socket.emit('enterSpectator', roomId);
  };

//   const leaveRoomSpectator = () => {
// 	socket.emit('leaveRoomSpectator');
//   };

  let lastType: string | undefined = undefined;
  const sendKey = (type: string, key: string) => {
	if (lastType === type) {
	  return;
	}
	lastType = type;
	socket.emit('sendKey', { type, key });
  };

  export {
	GameContext,
	GameProvider,
	type State,
	sendMessage,
	createRoom,
	leaveRoom,
	joinRoom,
	gameLoaded,
	execMatch,
	addOnQueue,
	sendKey,
	enterSpectator,
	// leaveRoomSpectator,
	exitQueue,
	customizeAndPlay,
	login,
  };
