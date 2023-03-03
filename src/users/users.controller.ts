import * as common from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { PurchaseDto } from './dto/buy-product.dto';
import { OrderService } from './order.service';

@ApiTags('Users')
@common.Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly orderService: OrderService,
  ) {}

  @common.Post()
  @common.HttpCode(common.HttpStatus.CREATED)
  create(@common.Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto);
  }

  @common.SerializeOptions({
    groups: ['admin'],
  })
  @common.Get()
  @common.HttpCode(common.HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @common.SerializeOptions({
    groups: ['admin'],
  })
  @common.Get(':id')
  @common.HttpCode(common.HttpStatus.OK)
  findOne(@common.Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @common.SerializeOptions({
    groups: ['admin'],
  })
  @common.Patch(':id')
  @common.HttpCode(common.HttpStatus.OK)
  update(
    @common.Param('id') id: number,
    @common.Body() updateProfileDto: CreateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @common.Delete(':id')
  remove(@common.Param('id') id: number) {
    return this.usersService.softDelete(id);
  }

  @common.Post('/deposit')
  @ApiBearerAuth()
  @common.UseGuards(AuthGuard('jwt'), RolesGuard)
  @common.HttpCode(common.HttpStatus.OK)
  @Roles(RoleEnum.buyer)
  deposit(@common.Request() request, @common.Body() deposit: UpdateDepositDto) {
    return this.orderService.deposit(deposit, request.user);
  }

  @common.Post('/buy')
  @ApiBearerAuth()
  @common.UseGuards(AuthGuard('jwt'), RolesGuard)
  @common.HttpCode(common.HttpStatus.OK)
  @Roles(RoleEnum.buyer)
  buy(@common.Request() request, @common.Body() deposit: PurchaseDto) {
    return this.orderService.buy(deposit, request.user);
  }

  @common.Put('/reset')
  @ApiBearerAuth()
  @common.UseGuards(AuthGuard('jwt'), RolesGuard)
  @common.HttpCode(common.HttpStatus.OK)
  @Roles(RoleEnum.buyer)
  reset(@common.Request() request) {
    return this.orderService.reset(request.user);
  }
}
