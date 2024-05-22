import { IsString } from 'class-validator';

export class JoinGameDTO {
  @IsString()
  readonly gameId!: string;
}
