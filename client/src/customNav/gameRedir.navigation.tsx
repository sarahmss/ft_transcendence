import { chatSocket } from "../contexts/ChatContext";


const GameRoomNavigationWrapper = ({ children } : {children: any}) => {

	chatSocket.on('redir-private-match', (response: any) => {
    window.location.href = `/game/${response.gameRoomId}/host`;
	});

  return (
    <div>
      { children }
    </div>
  );
}

export default GameRoomNavigationWrapper;
