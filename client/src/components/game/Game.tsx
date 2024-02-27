import Phaser from 'phaser';
import React, { Component } from 'react';
import { gameLoaded, GameContext, leaveRoom, sendKey, State } from '../../contexts/GameContext';
import {
	Button,
	Stack,
	Box,
	Typography
} from '@mui/material';

interface PongGameState {
	eventListenerAdded: boolean;
	handleKeyEvent: any;
	player1: any;
	player2: any;
	ball: any;
	message: any;
	score_text1: any;
	score_text2: any;
	config: any;
	state: any;
	game: any;
	match:any;
  }
class PongGame extends React.Component<{}, PongGameState> {

    constructor(props: any) {
        super(props);

		this.state = {
			eventListenerAdded: false,
			handleKeyEvent: this.handleKeyEvent.bind(this),
			player1: null,
			player2: null,
			ball: null,
			message: null,
			score_text1: null,
			score_text2: null,
			config: null,
			state: {
				match: null,
			},
			match: null,
			game: null,
		};
    }
    componentDidMount() {
		const context = this.context as State;
        const current_player = context.current_player;
        const match = context.match;
        this.setState({match: match});
		let backgroundColor;
		if(current_player.state !== 'watching'){
			backgroundColor = current_player.customizations.backgroundColor;
		}
		else
			backgroundColor = 0x000000;
		const height = match.gameConfig.height;
		const width = match.gameConfig.width;
        this.setState({
			config: {
				type: Phaser.AUTO,
				width: width,
				height: height,
				parent: 'pong-game-container',
				scene: {
					preload: () => this.preload(),
					update: () => this.update(),
				},
				backgroundColor: backgroundColor,
			},
		}, () => {
			console.log('CONFIG: ', this.state.config);
			this.setState({game: new Phaser.Game(this.state.config)});
		});
		// verificar se tem customizations em current_player (ele pode ser um espectador apenas, daí não teria esse obj dentro)
		//if (current_player.customizations && current_player.customizations.roundedMode === 'yes')
		//	this.game.canvas.style.borderRadius = "15px";
        if (!this.state.eventListenerAdded && current_player.state !== 'watching') {
			document.addEventListener('keydown', this.handleKeyEvent);
            document.addEventListener('keyup', this.handleKeyEvent);
            this.setState({eventListenerAdded: true});
        }
		gameLoaded();
    }

	preload() {
		const context = this.context as State;
		const match = context.match;
        const { gameConfig, ball, player1, player2 } = match;
		const current_player = context.current_player;
        if (this.state.game.scene.scenes[0]) {

			if (player1)
			{
				let corPhaser1;
				if (current_player.state !== 'watching')
					corPhaser1 = parseInt(current_player.customizations.paddleColor.replace("#", "0x"));
				else
					corPhaser1 = 0xffffff;
				this.setState({player1: this.state.game.scene.scenes[0].add.rectangle(
					player1.x,
					player1.y,
					player1.width,
					player1.height,
					corPhaser1
					)});
			}
			if (player2)
			{
				let corPhaser2;
				if (current_player.state !== 'watching')
					corPhaser2 = parseInt(current_player.customizations.paddleColor.replace("#", "0x"));
				else
					corPhaser2 = 0xffffff;
				if (current_player.state !== 'watching')
					corPhaser2 = parseInt(current_player.customizations.paddleColor.replace("#", "0x"));
				else
					corPhaser2 = 0xfff;
				this.setState({player2: this.state.game.scene.scenes[0].add.rectangle(
					player2.x,
					player2.y,
					player2.width,
					player2.height,
					corPhaser2
				)});
				this.setState({score_text1: this.state.game.scene.scenes[0].add.text(gameConfig.width / 2 - 75, 45, match.score1, {
            	    fontSize: '24px',
            	    fill: '#fff',
            	}).setOrigin(0.5)});
				
				this.setState({score_text2: this.state.game.scene.scenes[0].add.text(gameConfig.width / 2 + 75, 45, match.score2, {
            	    fontSize: '24px',
            	    fill: '#fff',
            	}).setOrigin(0.5)});

				const line = new Phaser.Geom.Line(gameConfig.width / 2, 0, gameConfig.width / 2, gameConfig.height);
				const graphics = this.state.game.scene.scenes[0].add.graphics();
				graphics.lineStyle(3, 0xffffff);
				graphics.strokeLineShape(line);
        }
	}
}

    update() {
		const context = this.context as State;
        const match = context.match;
        const { ball, player1, player2 } = match;
			if(this.state.player1 && player1) {
				this.state.player1.x = player1.x;
				this.state.player1.y = player1.y;
			}
			
			if(this.state.player2 && player2) {
				this.state.player2.x = player2.x;
				this.state.player2.y = player2.y;
			}
			if(this.state.ball && ball) {
				this.state.ball.x = ball.x;
				this.state.ball.y = ball.y;
			}
			else if (ball && this.state.game.scene.scenes[0])
			{
				this.setState({ball: this.state.game.scene.scenes[0].add.circle(ball.x, ball.y, ball.width, 0xffffff)});
			}
			if (this.state.score_text1 && this.state.score_text1.setText)
				this.state.score_text1.setText(match.score1);
			if (this.state.score_text2 && this.state.score_text2.setText) 
				this.state.score_text2.setText(match.score2);	
	}
			
	handleKeyEvent(e: any) {
		const { key, type } = e;
        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown':
                sendKey(type, key);
                e.preventDefault();
                break;
        }
    }
    componentWillUnmount() {
        if(this.state.eventListenerAdded) {
            document.removeEventListener('keydown', this.handleKeyEvent);
            document.removeEventListener('keyup', this.handleKeyEvent);
            this.setState({eventListenerAdded: false});
        }
		this.setState({ball: null});
		this.setState({player1: null});
		this.setState({player2: null});
		this.setState({score_text1: null});
		this.setState({score_text2: null});
        if(this.state.game) {
            this.state.game.destroy(true);
        }
    }

    render() {
		const context = this.context as State;
        const match = context.match;
		const current_player = context.current_player;
        const current_room = context.current_room;
		const { message } = match;

        return (
            <Box display="flex" sx={{ flexDirection:"column", alignItems:"center", margin:'auto', width:'fit-content'}}>
                <Stack>
					<Box id="pong-game-container"></Box>
					<Box>
						<Typography variant="h2" color="#B700cc" fontWeight="bold" >{current_room?.player1Name} vs {current_room?.player2Name}</Typography>
					</Box>
				</Stack>
                { (message && current_player.state === 'in_game') &&
                    <Box className='game-message'>
                        <h4>{message}</h4>
                    </Box>
                }
				{(current_player.state && (current_player.state === 'watching' || current_player.state === 'in_game')) &&
						<>
							<Box>
								<Button
									onClick={leaveRoom}
									sx={{ backgroundColor:"#B700cc", color: "#fff" }}
								>
									Leave Room
								</Button>
							</Box>
						</>
					}
				{ ( current_player.state === 'watching' && match.status !== 'START' && match.status !== 'PLAY' ) &&
					<Box className='game-message'>
						<Typography variant="h4">Open room - Waiting for a match... </Typography>
					</Box>
				}
            </Box>
        ); 
    }
};

PongGame.contextType = GameContext;
export default PongGame;

