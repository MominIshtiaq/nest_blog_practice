import { Profile } from 'src/profile/profile.entity';
import { Tweet } from 'src/tweet/tweet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 24,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deteledAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['insert'],
  })
  profile: Profile;

  @OneToMany(() => Tweet, (tweets) => tweets.user)
  tweets: Tweet[];
}
