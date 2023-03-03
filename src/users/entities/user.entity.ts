import * as typeorm from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
// import { EntityHelper } from 'src/utils/entity-helper';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'typeorm';

@typeorm.Entity()
export class User extends BaseEntity {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @typeorm.Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @typeorm.Column({ nullable: true })
  deposit: number;

  @typeorm.ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;
}
