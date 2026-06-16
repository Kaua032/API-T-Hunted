import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

export enum CarCondition {
  LOOSE = 'loose',
  CARDED = 'carded',
}

@Entity('collections')
@Unique(['user', 'car', 'condition'])
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({
    type: 'enum',
    enum: CarCondition,
    default: CarCondition.LOOSE,
  })
  condition!: CarCondition;

  @ManyToOne(() => User, (user) => user.collections, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  car!: Car;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}