import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PaginationModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    /*{ // This guard will be applied globally. This mean all the routes are protected now
      provide: 'APP_GUARD', // -> This will apply the guard globally. its a good  practice to add them on auth module or app module.
      useClass: AuthorizeGuard,
    },*/
  ],
  exports: [UserService],
})
export class UserModule {}

/* 
To add Module level Guard. We need to take create of two things.
1. ConfigModule
2. Register the JwtModule

Then is the providers array create an object
{
provide: 'APP_GUARD' // constant to with a unique guard identifier
useClass: AuthorizeGuard // guard for the moduke level
}
*/
