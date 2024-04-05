import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entity/product.entity';

@Entity()
export class User {
  constructor(
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  @Exclude()
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToMany(() => Product, (product) => product.createdBy)
  public createdProducts: Product[];

  @OneToMany(() => Product, (product) => product.updatedBy)
  public updatedProducts: Product[];
}
