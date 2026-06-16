import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'toy_number' })
  toyNumber!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 150 })
  series!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'varchar', nullable: true, name: 'image_url' })
  imageUrl!: string;

  @Column({ type: 'boolean', default: false, name: 'is_th' })
  isTh!: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_sth' })
  isSth!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'average_price' })
  averagePrice!: number | null;

  @Column({ type: 'timestamp', nullable: true, name: 'last_update_at' })
  lastUpdateAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}