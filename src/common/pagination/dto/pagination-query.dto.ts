import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // we are going to read this from the URL and they will be of type "string" and thus we added the "Type" class-transformer to format/transform them to "Number" Type. This is an Explicit type conversion.
  //@Type(() => Number)
  // For implicit type casting go the main.ts file and in the useGlobalPipes where we add the ValidationPipe pass the object with transform and transformOptions confiuration options and set the enableImplicitConversion to true like
  /*
  new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
})
  */
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
