import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseFilters,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDTO } from './dto/create-game.dto';
import { HttpExceptionFilter } from '@app/filters/http-exception.filter';

@Controller('games')
@UseFilters(HttpExceptionFilter)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create-game')
  @HttpCode(HttpStatus.CREATED)
  createGame(@Body() createGameDto: CreateGameDTO) {
    const game = this.gameService.createGame(createGameDto);
    return game;
  }
}
