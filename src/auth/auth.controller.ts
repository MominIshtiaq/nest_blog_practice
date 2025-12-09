import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() userDto: UserDto) {
    return await this.authService.login(userDto);
  }

  @AllowAnonymous()
  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}
