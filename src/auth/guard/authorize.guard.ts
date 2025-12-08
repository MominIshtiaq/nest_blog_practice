import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import authConfig from '../config/auth.config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfigurtaion: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //1. extract request from ExecutionContext
    const request: Request = context.switchToHttp().getRequest();

    //2. extract token from the requet header
    const token: string = request.headers.authorization?.split(' ')[1] ?? '';

    //3. validate token and provide / deny access
    if (!token) {
      throw new UnauthorizedException(
        {
          status: 401,
          message: 'Invalid or expired token',
        },
        {
          description: 'The invalid token in the Request header',
        },
      );
    }

    // const valid = await this.jwtService.verifyAsync(token, {
    //   secret: this.authConfigurtaion.secret,
    //   maxAge: this.authConfigurtaion.expiresIn,
    //   audience: this.authConfigurtaion.audience,
    //   issuer: this.authConfigurtaion.issuer,
    // });

    /* authConfiguration is equal to 
    authConfigurtaion: {
        secret: string | undefined;
        expiresIn: number;
        audience: string | undefined;
        issuer: string | undefined;
    } 
    */

    try {
      // this returns the payload of the token
      const payload = await this.jwtService.verifyAsync(
        token,
        this.authConfigurtaion,
      );

      // verify the user
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      request['user'] = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
