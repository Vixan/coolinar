import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  dateCreated: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  dateUpdated: Date;
}
