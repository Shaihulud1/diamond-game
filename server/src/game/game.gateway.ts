import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { JoinGameDTO } from './dto/join-game.dto';
import { MakeMoveDTO } from './dto/make-move.dto';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '@app/filters/ws-exception.filter';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UseFilters(new WsExceptionFilter())
export class GameGateway {
  @WebSocketServer()
  private server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() joinGameDTO: JoinGameDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.gameService.joinGame(client.id, joinGameDTO);

    client.join(game.id);

    if (this.gameService.canStartGame(game.id)) {
      this.server
        .to(game.id)
        .emit('gameStart', { game: this.gameService.startGame(game.id) });
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() makeMoveDTO: MakeMoveDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const makeMoveResult = this.gameService.makeMove(client.id, makeMoveDTO);
    if (makeMoveResult.winner) {
      this.server.to(makeMoveResult.game.id).emit('gameWinner', {
        playerWin: client.id,
        game: makeMoveResult.game,
      });
      this.gameService.finishGame(makeMoveResult.game.id);
    } else {
      this.server.to(makeMoveResult.game.id).emit('moveResult', {
        game: makeMoveResult.game,
      });
    }
  }
}
