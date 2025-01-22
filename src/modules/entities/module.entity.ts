import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column()
  path: string;
}