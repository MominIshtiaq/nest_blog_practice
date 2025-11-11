import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HashTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  name: string;
}
