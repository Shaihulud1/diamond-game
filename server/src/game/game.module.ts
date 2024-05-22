import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameStore } from './game.store';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameGateway, GameService, GameStore],
})
export class GameModule {}
