// src/models/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Favourite } from './Favourite.js';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  verified!: boolean;

  @Column({ nullable: true })
  verificationToken!: string;

  @Column({ nullable: true })
  refreshToken!: string;

  @OneToMany(() => Favourite, (favourite) => favourite.user, { lazy: true })
  favorites!: Promise<Favourite[]>;
}
