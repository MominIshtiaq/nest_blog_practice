/* 
The AllowAnonymous will act as a factory and from this method/function we will return a decorator
It takes the following parameters
target (type any) the target on which we are using this decorator
propertyKey (type string)
propertyDescriptor (type PropertyDesciptor)
*/

/*
Nest js Build in Decortor it takes two parameter: metadataKey, metadataValue
What this SetMetadata will do is that whichever route we apply the AllowAnonymous decorator to
it is going to set this isPublic metadata property to true on ExecutionContext
*/
import { SetMetadata } from '@nestjs/common';

export const AllowAnonymous = () => {
  // custom decorator function signature
  //   return (
  //     target: any,
  //     propertyKey: string,
  //     propertyDescriptor: PropertyDescriptor,
  //   ) => {};

  return SetMetadata('isPublic', true);
};
