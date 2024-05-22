import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDTO } from './dto/create-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create-game')
  @HttpCode(HttpStatus.CREATED)
  createGame(@Body() createGameDto: CreateGameDTO) {
    const game = this.gameService.createGame(createGameDto);
    return game;
  }
}
