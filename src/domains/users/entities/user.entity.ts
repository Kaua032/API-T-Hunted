import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  @Column({ type: 'varchar', length: 255 })
  name!: string;
  
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;
  
  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections!: Collection[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
