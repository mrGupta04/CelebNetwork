import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne} from 'typeorm';
import { User } from '../auth/user.entity'; 

@Entity()
export class Celebrity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  country: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  youtube?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  setlist?: string;

  @Column()
  fanbase: number;

  
 @ManyToOne(() => User, (user) => user.celebrities)
  user: User;

  // ✅ Add this field
  @Column({ unique: true })
  email: string;
  
}
