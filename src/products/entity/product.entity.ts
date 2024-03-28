import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Product {
  @Exclude()
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public productId: string;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @Column()
  public thumbnail: string;

  @Column('text', { array: true })
  public photoAlbum: string[];

  @ManyToOne(() => User, (user) => user.products)
  public createdBy: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
