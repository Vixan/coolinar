import { Entity, ObjectID, ObjectIdColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, MaxLength, IsEmail } from 'class-validator';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;

  constructor(props: any) {
    Object.assign(this, props);
  }
}
