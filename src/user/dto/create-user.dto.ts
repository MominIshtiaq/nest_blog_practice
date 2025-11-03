import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'first name must be a string' })
  @MinLength(3, { message: 'first name must be at least 3 characters' })
  @MaxLength(100, { message: 'first name must be at most 100 characters' })
  firstName: string;

  @IsNotEmpty()
  @IsString({ message: 'last name must be a string' })
  @MinLength(3, { message: 'last name must be at least 3 characters' })
  @MaxLength(100, { message: 'last name must be at most 100 characters' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'gender must be a string' })
  @MaxLength(10, { message: 'gender must be at most 10 characters' })
  gender?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100, { message: 'email must be at most 100 characters' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @MaxLength(100, { message: 'password must be at most 100 characters' })
  password: string;
}
