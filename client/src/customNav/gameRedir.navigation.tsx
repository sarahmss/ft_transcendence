// import { useNavigate } from "react-router-dom"
import { chatSocket } from "../contexts/ChatContext";


const GameRoomNavigationWrapper = ({ children } : {children: any}) => {
  // const navigate = useNavigate();

	chatSocket.on('redir-private-match', (response: any) => {
		// navigate(`/game/${response.gameid}`);
    window.location.href = `/game/${response.gameId}`;
	});

  return (
    <div>
      { children }
    </div>
  );
}

export default GameRoomNavigationWrapper;
