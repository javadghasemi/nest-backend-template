import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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

  @CreateDateColumn({ type: 'timestamp', default: 'CURRENT_TIMESTAMP(6)' })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
