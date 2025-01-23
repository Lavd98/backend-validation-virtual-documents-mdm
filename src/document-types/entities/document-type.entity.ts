import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DocumentTypes')
export class DocumentType {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 100 })
  Name: string;

  @Column({ type: 'bit', default: true })
  IsActive: boolean;
}
