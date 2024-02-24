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
  isUserLogged: true,
  players: {},
  current_player: { name: '' },
  current_room: { name: '', player1Name: '', player2Name: '' },
  rooms: {},
  messages: [],
  match: {},
  in_waiting: 0,
};

const GameContext = createContext<State | undefined>(undefined);

const GameProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
      // Função para obter os dados do localStorage de forma assíncrona
      function getStoredPlayerData(): Promise<{ userName: string, userId: string } | null> {
        return new Promise((resolve) => {
          const storedPlayer = AuthService.getCurrentUserPlay();
          const userName = storedPlayer?.userName;
          const userId = storedPlayer?.userId;

          // Verifica se ambos os valores existem
          if (userName !== null && userId !== null) {
            resolve({ userName, userId });
          } else {
            resolve(null);
          }
        });
      }

      // Função para obter os dados do jogador do localStorage de forma assíncrona
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

    //por conta da possibilidade de convite para um jogo a partir do chat,
    //essa função poderá receber argumentos... (idUser e typeUser)
    const fetchUserLocalStorage = async (gameId?: string, role?: string) => {
      try {
        const storedPlayer = await getStoredPlayerData();
  
        if (storedPlayer !== null) {
          const storedPlayerSocket = await getStoredPlayerSocket(storedPlayer.userId);
  
          if (storedPlayerSocket !== null) {
            console.log('Jogador já existe e é uma reconexão.');
            console.log('StoredPlayerSocket: ', storedPlayerSocket);
            gameSocket.emit('reconnect', storedPlayerSocket);
          } else {

            // aqui vai ter que verificar se argumentos (url vindos por parametro do método)
            //existem/foram passados. Se sim, então não é um login normal que chama.. e sim
            //um que faz todo o processo que o fluxo normal realizaria até chegar na tela
            //de customização (passa para o emit os argumentos que foram resgatados anterior-
            //mente da url para que o servidor saiba criar/encontrar a sala e jogar os clients
            //lá dentro e já criar as estruturas, etc)
            //a gravação do id do socket do host (e do guest)
            //só vai acontecer depois do login... e os dois vão
            //ter que passar por aqui.
            //Ou seja, vai ter que ter um tempinho a mais pro
            //guest procurar o host no localStorage pra encontrar
            //o id dele... um tempo de 5 segundos Será que é suficiente?
            //e aí deixa ele numa tela de carregamento? (a do connecting mesmo,
            //porque daí ele só seria conectado (dispatch CONNECTED) depois que conseguir
            //resgatar o id do socket do host atraves do ID do banco
            //e entrar na sala a partir do servidor)

            //Então o código aqui ficaria algo como:
            // if (args -> argumentos que esse método recebe && typeUser == 'host') {
            //  const name = storedPlayer.userName;
            //  const userIdDataBase = storedPlayer.userId;
            //  gameSocket.emit('loginHostPrivateMatch', {hostUserIdDB, userIdDataBase, typeUser}) // daí lá no server é só usar o id do socket dele pra criar a sala
            //}
            // else if (args -> argumentos que esse método recebe && typeUser == 'guest') {
            //  const name = storedPlayer.userName;
            //  const userIdDataBase = storedPlayer.userId;
            //  ---> dá um tempo de uns 5 segundos pra resgatar a instancia do host do localStorage?
            //      const storedMatchHostSocket = await getStoredPlayerSocket(hostUserIdDB); -> espera uns 5 segundos pra fazer isso
            //      const matchHostSocketID = storedMatchHostSocket?.id;
            //  -- e depois chama:
            //  if (matchHostSocketID) {
            //    console.log(`Encontramos o socket do host. O id do socket é ${matchHostSocketID}`);
            //    gameSocket.emit('loginGuestPrivateMatch', {hostUserIdDB, matchHostSocketID, userIdDataBase, typeUser});
            //  }
            //  else
            //    console.log('Não foi possível resgatar o id do socket do Host. Seu usuário será logado no modo público');
            //}
            // else if (!args) --> condição pro login normal abaixo
            if (gameId && role)
            {
              const name = storedPlayer.userName;
              const userIdDataBase = storedPlayer.userId;
              if (role === 'guest') {
                console.log('Método disparado no server será o login Guest -> criará a sala e emitirá para o chat socket do host');
                gameSocket.emit('loginGuestPrivateMatch', {gameId, role, name, userIdDataBase});
              }
              else if (role === 'host') {
                console.log('Método disparado no server será o login Host -> entrará na sala já existente.');
                // DEPOIS DESCOMENTA PRA TESTAR O RESTO:
                gameSocket.emit('loginHostPrivateMatch', {gameId, role, name, userIdDataBase});
              }
            } else {
              console.log('Jogador ainda não existe e precisa logar.');
              console.log('Nome: ', storedPlayer.userName, 'UserId do banco: ', storedPlayer.userId);
              const name = storedPlayer.userName;
              const userIdDataBase = storedPlayer.userId;
              gameSocket.emit('login', {name, userIdDataBase});
            }
          }
          dispatch({ type: 'CONNECTED', payload: true });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do localStorage:', error);
        dispatch({ type: 'LOGGED', payload: false });
      }
    };

    gameSocket.on('connect', async () => {
      //aqui, consultar a url -> pra verificar se o socket se conectou nesse contexto
      //porque foi CONVIDADO para uma SALA PRIVADA
      //se sim, passar os argumentos (idUser e typeUser para o método abaixo)
      console.log('URL ao entrar na pagina: ', window.location.href);
      const url = window.location.href;
      const parts = url.split("/");
      console.log('A url tem ', parts.length, ' partes.');

      //LEMBRAR QUE: precisa GARANTIR que não é a url pequena, mas a com os parametros
      if (parts.length >= 6) {
        const gameId = parts[4]; // "06f41cf1-166c-4e39-82f8-6a806b8785cd"
        const role = parts[5];   // "guest"    
        console.log("Game ID:", gameId);
        console.log("Role:", role);
        await fetchUserLocalStorage(gameId, role);
      }
      else {
        console.log('Esse usuario não veio por convite');
        await fetchUserLocalStorage();
      }
      //se bem sucedido, passar os parametros para a função fetch, para que ela possa
      //repassar para o servidor e, assim, criar ja a sala
      //daí fazemos a emissão para o socket do chat da pessoa que convidou
      // await fetchUserLocalStorage();
		// const storedPlayer = AuthService.getCurrentUserPlay();
		// if (!storedPlayer){
		// 	dispatch({ type: 'LOGGED', payload: false });
		// 	return;
		// }
    // verificar se um item com o userId desse storedPlayer já existe,
    // se sim, quer dizer que já houve um setItem desse usuario - então
    // a probabilidade é que essa é uma reconexão do socket desse usuario
    // (passa o player salvo no localStorage com o userId do storedPlayer
    // como chave). Do contrario (nao tem item no localStorage com essa userId),
    // essa é a primeira vez que o socket está logando no
    // contexto do Game, então é preciso ir pro login e salvar esse player
    // no array de players pela primeira vez
		// if (storedPlayer !== null) {
    //   const storedPlayerSocketString = localStorage.getItem(storedPlayer.userId);
    //   if (storedPlayerSocketString)
    //   {
    //     const storedPlayerSocket = JSON.parse(storedPlayerSocketString);
    //     console.log('Jogador ja existe e é uma reconexão.');
    //     console.log('StoredPlayerSocket: ', storedPlayerSocket);
    //     // gameSocket.emit('reconnect', storedPlayer);
    //     gameSocket.emit('reconnect', storedPlayerSocket);
    //   }
    //   else
    //   {
    //     console.log('Jogador ainda nao existe e precisa logar.');
    //     console.log('Nome: ', storedPlayer.userName, 'UserId do banco: ', storedPlayer.userId);
    //     gameSocket.emit('login', storedPlayer.userName, storedPlayer.userId);
    //   }
    //   dispatch({ type: 'CONNECTED', payload: true });
		// }
	});

    gameSocket.on('disconnect', () => {
      dispatch({ type: 'CONNECTED', payload: false });
    });

    gameSocket.on('PlayersRefresh', (players) => {
      if (!authService.getIsLogged()){
        return ;
      }
      const player = gameSocket.id ? players[gameSocket.id] : undefined; // ATENÇÃO
      console.log('Players: ', players);
      if (player)
      {
        const storedPlayer = AuthService.getCurrentUserPlay();
        if (!storedPlayer){
          dispatch({ type: 'LOGGED', payload: false });
          return;
        }
        sessionStorage.setItem(storedPlayer.userId, JSON.stringify(player));
        dispatch({type: 'PLAYER', payload: player});
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
      if (!authService.getIsLogged()){
        return ;
      }
      dispatch({type: 'ROOMS', payload: rooms});
      dispatch({type: 'ROOM', payload: gameSocket.id ? gameSocket.id : ""}); // ATENÇÃO
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
