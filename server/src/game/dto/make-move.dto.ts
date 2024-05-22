import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakeMoveDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly cellY!: number;
  @IsNumber()
  @IsNotEmpty()
  readonly cellX!: number;
}
