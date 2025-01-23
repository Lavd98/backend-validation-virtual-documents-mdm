import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Areas')
export class Area {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 100 })
  Name: string;

  @Column({ type: 'nvarchar', length: 20 })
  Abbreviation: string;

  @Column({ type: 'bit', default: true })
  IsActive: boolean;
}
