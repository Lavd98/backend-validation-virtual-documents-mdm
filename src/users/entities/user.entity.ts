import { Exclude } from 'class-transformer';
import { Area } from 'src/areas/entities/area.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Users')
export class User {
 @PrimaryGeneratedColumn()
 Id: number;

 @Column({ type: 'nvarchar', length: 100 })
 Name: string;

 @Exclude()
 @Column({ type: 'int' })
 AreaId: number;
 
 @ManyToOne(() => Area)
 @JoinColumn({ name: 'AreaId' })
 Area: Area;

 @Column({ type: 'nvarchar', length: 50 })
 Profile: string;

 @Exclude()
 @Column({ type: 'nvarchar', length: 255 })
 Password: string;

 @Column({ type: 'nvarchar', length: 50 })
 Username: string;

 @Column({ type: 'datetime2' })
 CreatedAt: Date;

 @Column({ type: 'datetime2', nullable: true })
 UpdatedAt: Date;

 @Column({ type: 'nvarchar', length: 255 })
 LastName: string;

 @Column({ type: 'bit', default: true })
 isActive: boolean;
}