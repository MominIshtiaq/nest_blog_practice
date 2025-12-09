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
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    // To read isPublic that has been added by the AllowAnonymous decorator we are going to use reflector class instance
    // This will allow us to read the meta data from the ExecutionContext
    private readonly reflector: Reflector,

    @Inject(authConfig.KEY)
    private readonly authConfigurtaion: ConfigType<typeof authConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read isPublic Metadata
    /* 
    The getAllAndOverride method of reflector takes two parameters
    first is which property to read (metadataKey (type string)) and second is from where (target (type (Function | Type<any>)[]))
    */
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(), // check on handler function like login, signup in auth.controller.ts
      context.getClass(), // check on class itself like User, Auth etc
    ]);

    if (isPublic) return true;

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

      request['user'] = payload;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
