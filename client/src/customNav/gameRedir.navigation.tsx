import { useNavigate } from "react-router-dom"
import { chatSocket } from "../contexts/ChatContext";


const GameRoomNavigationWrapper = ({ children } : {children: any}) => {
  const navigate = useNavigate();

	chatSocket.on('redir-private-match', (response) => {
    console.log('Em redir-private-match. Response: ', response);
		navigate(`/game/${response.gameRoomId}/host`);
	});

  return (
    <div>
      { children }
    </div>
  );
}

export default GameRoomNavigationWrapper;
