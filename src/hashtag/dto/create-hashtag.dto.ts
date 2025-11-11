import { IsNotEmpty, IsString } from 'class-validator';

export class createHashTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
