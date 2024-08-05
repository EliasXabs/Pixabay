// src/models/Favourite.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class Favourite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mediaId!: number;

  @Column()
  mediaUrl!: string;

  @Column()
  mediaType!: 'image' | 'video';

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>;
}
