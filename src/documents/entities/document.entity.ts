import { Area } from 'src/areas/entities/area.entity';
import { User } from 'src/users/entities/user.entity';
import { DocumentType } from 'src/document-types/entities/document-type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Documents')
export class Document {
 @PrimaryGeneratedColumn()
 Id: number;

 @Column({ type: 'nvarchar', length: 50, unique: true })
 VerificationCode: string;

 @Column({ type: 'int' })
 AreaId: number;

 @ManyToOne(() => Area)
 @JoinColumn({ name: 'AreaId' })
 Area: Area;

 @Column({ type: 'int' })
 TypeId: number;

 @ManyToOne(() => DocumentType)
 @JoinColumn({ name: 'TypeId' })
 Type: DocumentType;

 @Column({ type: 'int' })
 YearPublication: number;

 @Column({ type: 'nvarchar', length: 255 })
 Name: string;

 @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
 Description: string;

 @Column({ type: 'nvarchar', length: 255, nullable: true })
 FilePath: string;

 @Column({ type: 'datetime2' })
 CreatedAt: Date;

 @Column({ type: 'datetime2', nullable: true })
 UpdatedAt: Date;

 @Column({ type: 'bit', default: true })
 IsActive: boolean;

 @Column({ type: 'int' })
 UserId: number;

 @ManyToOne(() => User)
 @JoinColumn({ name: 'UserId' })
 User: User;
}
