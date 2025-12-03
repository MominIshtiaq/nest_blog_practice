import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { type Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ) {
    const limit = paginationQueryDto.limit ?? 10;
    const page = paginationQueryDto.page ?? 1;

    const findOptions: FindManyOptions<T> = {
      take: limit,
      skip: (page - 1) * limit,
    };

    if (where) {
      findOptions.where = where;
    }

    const result = await repository.find(findOptions);

    // To get number of items in the table.
    const totalItems = await repository.count();
    // We do Math.ceil because suppose totalItems is 72 and limit is 10 it will be 7.2
    // and we want it to be next whole number so "8" in this case.
    const totalPages = Math.ceil(totalItems / limit);

    const currentPage = page;
    // First we need to check that page is equal to the totalPages then the user cannot move to the next page
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    // First we need to check that if page is equal to one then the user cannot move to any pervious page
    const perivousPage = currentPage === 1 ? currentPage : currentPage - 1;

    // this.request.protocol is equal to http or https
    // this.request.hostname is equal to localhost
    // this.request.headers.host is equal to localhost:3000
    // baseUrl = http://localhost:3000/
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const response = {
      data: result,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        page: '',
        last: '',
        current: '',
        next: '',
        previous: '',
      },
    };

    return response;
  }
}
