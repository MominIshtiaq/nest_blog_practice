import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
// import { AuthorizeGuard } from 'src/auth/guard/authorize.guard';

@Controller('user')
// @UseGuards(AuthorizeGuard) guard on controller level
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthorizeGuard) guard on controller route level
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
