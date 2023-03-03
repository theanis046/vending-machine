import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (countUser === 0) {
      await this.addRole({ id: RoleEnum.user, name: 'User' });
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (countAdmin === 0) {
      await this.addRole({
        id: RoleEnum.admin,
        name: 'Admin',
      });
    }

    const countBuyer = await this.repository.count({
      where: {
        id: RoleEnum.buyer,
      },
    });

    if (countBuyer === 0) {
      await this.addRole({
        id: RoleEnum.buyer,
        name: 'Buyer',
      });
    }

    const countSeller = await this.repository.count({
      where: {
        id: RoleEnum.seller,
      },
    });

    if (countSeller === 0) {
      await this.addRole({
        id: RoleEnum.seller,
        name: 'Seller',
      });
    }
  }

  private async addRole(options: { id: RoleEnum; name: string }) {
    await this.repository.save(
      this.repository.create({
        id: options.id,
        name: options.name,
      }),
    );
  }
}
