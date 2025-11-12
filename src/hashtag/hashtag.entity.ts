import { Tweet } from 'src/tweet/tweet.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HashTag {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;

  // we added the onDelete "CASCADE" configuration here. because if we try to delete it without the configuration
  // we have a foreign key relation in the bridge table (tweet_hashtags_hashtag) and if we try to delete the hashtag without deleting the foreign key relation.
  // the database throws an error. To resolve this issue we add the onDelete configuration. this will first delete the relationship entity in the bridge table.
  // and then delete the hashtag entity.
  @ManyToMany(() => Tweet, (tweets) => tweets.hashtags, { onDelete: 'CASCADE' })
  tweets: Tweet[];
}
