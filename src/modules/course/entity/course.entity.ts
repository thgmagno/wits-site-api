import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Courses {
  @PrimaryGeneratedColumn()
  id_course: number;

  @Column()
  course_name: string;

  @Column()
  points_worth: number;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Courses as Course };
