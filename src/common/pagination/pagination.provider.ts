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
import { Paginated } from './paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<Paginated<T>> {
    const limit = paginationQueryDto.limit ?? 10;
    const page = paginationQueryDto.page ?? 1;

    const findOptions: FindManyOptions<T> = {
      take: limit,
      skip: (page - 1) * limit,
    };

    if (where) {
      findOptions.where = where;
    }

    if (relations && relations?.length > 0) {
      findOptions.relations = relations;
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

    // suppose the url is http://localhost:3000/tweet/11?limit=10&page=1
    // this.request.protocol is equal to http or https
    // this.request.hostname is equal to localhost
    // this.request.headers.host is equal to localhost:3000
    // this.request.url is equal to tweet/11?limit=10&page=1

    // baseUrl = http://localhost:3000/
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);

    /*
    if we console log the newUrl we will get the following object.
    we will use the origin and pathname to construct the links.
    newUrl = {
      href: "http://localhost:3000/tweet/11?limit=10&page=1",
      origin: "http://localhost:3000",
      protocol: "http:",
      username: "",
      password: "",
      host: "localhost:3000",
      hostname: "localhost",
      port: "3000",
      pathname: "/tweet/11",
      search: "?limit=5&page=3",
      searchParams: URLSearchParams {'limit' => "5", "page" => '3'}
      hash: ''
    }
    */

    const response = {
      data: result,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${currentPage}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${perivousPage}`,
      },
    };

    return response;
  }
}
