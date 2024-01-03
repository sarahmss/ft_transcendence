import React, { useEffect,
				useReducer,
				createContext,
				useState} from "react";
import socketClient from 'socket.io-client';
import AuthService from "../services/auth.service";
import { GameLink } from "../common/constants"

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

const gameSocket = socketClient(GameLink, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
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
    gameSocket.on('connect', () => {
		const storedPlayer = AuthService.getCurrentUser();
		// if (!storedPlayer){
		// 	setRedirect("/home");
		// }
		if (storedPlayer !== null) {
			gameSocket.emit('reconnect', storedPlayer);
		}
		gameSocket.emit('login', storedPlayer.userName);
		dispatch({ type: 'CONNECTED', payload: true });
	});

	gameSocket.on('disconnect', () => {
		dispatch({ type: 'CONNECTED', payload: false });
	});

	gameSocket.on('PlayersRefresh', (players) => {
		const player = players[gameSocket.id];
		if (player)
		{
			const storedPlayer = AuthService.getCurrentUser();
			// if (!storedPlayer){
			// 	setRedirect("/home");
			// }
			localStorage.setItem(storedPlayer.userId, JSON.stringify(player));
			dispatch({type: 'PLAYER', payload: players[gameSocket.id]});
		}
		else {
			dispatch({type: 'RESET_STATE'});
		}
		dispatch({type: 'PLAYERS', payload: players});
	});
	gameSocket.on('ReceiveMessage', (receiveMessage) => {
		dispatch({type: 'MESSAGE', payload: receiveMessage });
	});
	gameSocket.on('RoomsRefresh', (rooms) => {
		dispatch({type: 'ROOMS', payload: rooms});
		dispatch({type: 'ROOM', payload: gameSocket.id});
	});
	gameSocket.on('MatchRefresh', (match) => {
		dispatch({type: 'MATCH', payload: match});
	});

	gameSocket.on('WaitingRefresh', (waitingLength) => {
		dispatch({type: 'WAITING_QUEUE', payload: waitingLength});
	});

	gameSocket.on('RemoveMatch', () => {
		dispatch({type: 'MATCH', payload: {}});
	})

	gameSocket.open();
  }, []);

  return (
    <GameContext.Provider value={state}>
      {props.children}
    </GameContext.Provider>
  );
};

// Restante do código...

const sendMessage = (message: string) => {
	gameSocket.emit('SendMessage', message);
  };

  const exitQueue = () => {
	gameSocket.emit('exitQueue');
  };

  const addOnQueue = () => {
	gameSocket.emit('addOnQueue');
  };

  const execMatch = () => {
	gameSocket.emit('execMatch');
  };

  const login = (name: string) => {
	gameSocket.emit('login', name);
  };

  const customizeAndPlay = (customChoices: any) => {
	gameSocket.emit('customizeAndPlay', customChoices);
  };

  const createRoom = () => {
	gameSocket.emit('createRoom');
  };

  const leaveRoom = () => {
	gameSocket.emit('leaveRoom');
  };

  const joinRoom = (roomId: string) => {
	gameSocket.emit('joinRoom', roomId);
  };

  const gameLoaded = () => {
	gameSocket.emit('gameLoaded');
  };

  const enterSpectator = (roomId: string) => {
	gameSocket.emit('enterSpectator', roomId);
  };

//   const leaveRoomSpectator = () => {
// 	gameSocket.emit('leaveRoomSpectator');
//   };

  let lastType: string | undefined = undefined;
  const sendKey = (type: string, key: string) => {
	if (lastType === type) {
	  return;
	}
	lastType = type;
	gameSocket.emit('sendKey', { type, key });
  };

  export type { State };

  export {
	GameContext,
	GameProvider,
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
