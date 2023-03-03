import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import { EntityHelper } from 'src/utils/entity-helper';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn("increment")
  id: number;

  
  @Column({ nullable: false })
  amountAvailable: number | 0;

  @Column()
  cost: number | 0;

  @Column()
  productName: string;

  
  @ManyToOne(() => User)
  user?: User | null;
}
