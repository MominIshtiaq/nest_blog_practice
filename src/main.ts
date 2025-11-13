import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Removes any properties from the incoming request body that are not defined in your DTO (Data Transfer Object).
      /*
      DTO class:
      export class CreateUserDto {
        name: string;
        age: number;
      }

      Incoming request:
      {
        "name": "John",
        "age": 25,
        "isAdmin": true
      }

      With whitelist: true:
      The property isAdmin is automatically removed before validation.
      The DTO received by your controller will be:
      {
        "name": "John",
        "age": 25
      }
      */
      whitelist: true,

      //Instead of silently removing extra fields (like whitelist does), this throws an error if any non-allowed property is present.
      /*
      DTO class
      export class CreateUserDto {
        name: string;
        age: number;
      }

      Incoming Request:
      {
        "name": "John",
        "age": 25,
        "isAdmin": true
      }

      Behavior with forbidNonWhitelisted: true:|
      NestJS will respond with:
      {
        "statusCode": 400,
        "message": [
          "property isAdmin should not exist"
        ],
        "error": "Bad Request"
      }
      */
      forbidNonWhitelisted: true,

      //Automatically transforms plain request objects into instances of your DTO class, and performs type conversion.
      // Without this, everything that comes from a request (query/body/params) is a string by default.
      /*
      With transform: true:
      NestJS automatically converts "5" → 5 (number) based on the DTO’s type.
      So inside your controller, id is a number, not a string.
      */
      transform: true,

      // This enable Typescript to implicit the type cast to the entity type.
      // e.g: Suppose we are reading a value from the URL it is a type of string. but in or DTO we have defined it a type of number. then this option is enabled it will automatically convert that string type to number type.
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
