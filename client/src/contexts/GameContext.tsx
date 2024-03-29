import React, { useEffect,
  useReducer,
  createContext} from "react";
import socketClient from 'socket.io-client';
import AuthService from "../services/auth.service";
import { GameLink } from "../common/constants"
import authService from "../services/auth.service";

interface Player {
name: string;
room?: string;
id?: string;
userIdDB?: any;
state?: string;
customizations?: any;
disconnected?: any;
timerId?: any;
}

interface Room {
name: string;
player1?: string;
player2?: string;
player1Name: string;
player2Name: string;
spectators?: Record<string, any>;
}

interface Match {
status?: string;
score1?: number;
score2?: number;
player1SocketID?: string;
player2SocketID?: string;
player1IdDb: string;
player2IdDb: string;
gameConfig?: any;
player1?: any;
player2?: any;
ball?: any;
message?: string;
accelerated?: boolean;
}

interface State {
isConnected: boolean;
isUserLogged: boolean;
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
| { type: 'LOGGED'; payload: boolean }
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
case 'LOGGED':
return {
  ...state,
  isUserLogged: action.payload,
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
  current_room: state.rooms[state.players[action.payload]?.room!],
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
isUserLogged: true,
players: {},
current_player: { name: '' },
current_room: { name: '', player1Name: '', player2Name: '' },
rooms: {},
messages: [],
match: {player1IdDb: '', player2IdDb: ''},
in_waiting: 0,
};

const GameContext = createContext<State | undefined>(undefined);

const GameProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
const [state, dispatch] = useReducer(reducer, initialState);

useEffect(() => {
function getStoredPlayerData(): Promise<{ userName: string, userId: string } | null> {
  return new Promise((resolve) => {
    const storedPlayer = AuthService.getCurrentUserPlay();
    const userName = storedPlayer?.userName;
    const userId = storedPlayer?.userId;

    if (userName !== null && userId !== null) {
      resolve({ userName, userId });
    } else {
      resolve(null);
    }
  });
}

function getStoredPlayerSocket(userId: string): Promise<any | null> {
  return new Promise((resolve) => {
    const storedPlayerSocketString = localStorage.getItem(userId);

    if (storedPlayerSocketString) {
      const storedPlayerSocket = JSON.parse(storedPlayerSocketString);
      resolve(storedPlayerSocket);
    } else {
      resolve(null);
    }
  });
}

const fetchUserLocalStorage = async (gameId?: string, role?: string) => {
try {
  const storedPlayer = await getStoredPlayerData();

  if (storedPlayer !== null) {
      if (gameId && role) {
        const name = storedPlayer.userName;
        const userIdDataBase = storedPlayer.userId;
        if (role === 'guest')
          gameSocket.emit('loginGuestPrivateMatch', {gameId, role, name, userIdDataBase});
        else if (role === 'host')
          gameSocket.emit('loginHostPrivateMatch', {gameId, role, name, userIdDataBase});
      } else {
        const name = storedPlayer.userName;
        const userIdDataBase = storedPlayer.userId;
        gameSocket.emit('login', {name, userIdDataBase});
      }
      dispatch({ type: 'CONNECTED', payload: true });
    }
  else {
    dispatch({ type: 'LOGGED', payload: false });
  }
  } catch (error) {
  dispatch({ type: 'LOGGED', payload: false });
}
};

gameSocket.on('connect', async () => {
const url = window.location.href;
const parts = url.split("/");
if (parts.length >= 6) {
  const gameId = parts[4];
  const role = parts[5];   
  await fetchUserLocalStorage(gameId, role);
} else
  await fetchUserLocalStorage();
});

gameSocket.on('disconnect', () => {
dispatch({ type: 'CONNECTED', payload: false });
});

gameSocket.on('PlayersRefresh', (players) => {
if (!authService.getIsLogged()) {
  return ;
}
const player = gameSocket.id ? players[gameSocket.id] : undefined;
if (player) {
  const storedPlayer = AuthService.getCurrentUserPlay();
  if (!storedPlayer) {
    dispatch({ type: 'LOGGED', payload: false });
    return;
  }
  sessionStorage.setItem(storedPlayer.userId, JSON.stringify(player));
  dispatch({type: 'PLAYER', payload: player});
}
else
  dispatch({type: 'RESET_STATE'});
dispatch({type: 'PLAYERS', payload: players});
});
gameSocket.on('ReceiveMessage', (receiveMessage) => {
dispatch({type: 'MESSAGE', payload: receiveMessage });
});
gameSocket.on('RoomsRefresh', (rooms) => {
if (!authService.getIsLogged()){
  return ;
}
dispatch({type: 'ROOMS', payload: rooms});
dispatch({type: 'ROOM', payload: gameSocket.id ? gameSocket.id : ""});
});
gameSocket.on('MatchRefresh', (match) => {
dispatch({type: 'MATCH', payload: match});
});

gameSocket.on('WaitingRefresh', (waitingLength) => {
dispatch({type: 'WAITING_QUEUE', payload: waitingLength});
});

gameSocket.on('RemoveMatch', () => {
dispatch({type: 'MATCH', payload: {player1IdDb: '', player2IdDb: ''}});
})

gameSocket.on('redirect', (newRoute) => {
  window.location.href = newRoute;
  })

gameSocket.open();

}, []);

return (
<GameContext.Provider value={state}>
{props.children}
</GameContext.Provider>
);
};

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
exitQueue,
customizeAndPlay,
login,
};
