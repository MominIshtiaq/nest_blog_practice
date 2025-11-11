import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'last name must be a string' })
  @MaxLength(24, { message: 'last name must be at most 100 characters' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100, { message: 'email must be at most 100 characters' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @MaxLength(100, { message: 'password must be at most 100 characters' })
  password: string;

  @IsOptional()
  profile?: CreateProfileDto;
}
