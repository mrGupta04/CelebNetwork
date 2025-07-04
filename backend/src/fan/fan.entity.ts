import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Celebrity } from '../celebrity/celebrity.entity';

@Entity('fan_follow')
export class FanFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  fan: User;

  @Column()
  fanId: number;

  @ManyToOne(() => Celebrity, { onDelete: 'CASCADE' })
  celebrity: Celebrity;

  @Column()
  celebrityId: string;
}
