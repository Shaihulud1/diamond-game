import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateGameDTO {
  @Max(6)
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  readonly fieldSize!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly diamonds!: number;
}
