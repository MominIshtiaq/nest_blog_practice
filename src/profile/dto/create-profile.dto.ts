import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
  IsDate,
} from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'first name must be a string' })
  @MinLength(3, { message: 'first name must be at least 3 characters' })
  @MaxLength(100, { message: 'first name must be at most 100 characters' })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'last name must be a string' })
  @MinLength(3, { message: 'last name must be at least 3 characters' })
  @MaxLength(100, { message: 'last name must be at most 100 characters' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'gender must be a string' })
  @MaxLength(10, { message: 'gender must be at most 10 characters' })
  gender?: string;

  @IsOptional()
  @IsDate()
  dateofBirth?: Date;

  @IsOptional()
  @IsString({ message: 'gender must be a string' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'gender must be a string' })
  profileImage?: string;
}
