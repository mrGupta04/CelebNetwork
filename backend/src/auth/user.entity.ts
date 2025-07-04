// src/auth/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { FanFollow } from '../fan/fan.entity';
import { Celebrity } from '../celebrity/celebrity.entity'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'fan' })
  role: string;

  @OneToMany(() => Celebrity, (celebrity) => celebrity.user)
  celebrities: Celebrity[];

  @OneToMany(() => FanFollow, (follow) => follow.fan)
  follows: FanFollow[];
}
