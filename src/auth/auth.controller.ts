import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async login(@Body() userDto: UserDto) {
    return await this.authService.login(userDto);
  }

  @Post('/signup')
  public async signup(@Body() createUserDto: CreateUserDto) {}
}
