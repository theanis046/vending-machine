import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ProductValidationPipe } from './product.validation';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request,
    @Body(new ProductValidationPipe()) createProfileDto: CreateProductDto,
  ) {
    return this.productsService.create(createProfileDto, request.user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.productsService.findAll();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateProfileDto: CreateProductDto) {
    return this.productsService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
}
