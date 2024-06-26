import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Permissions } from 'src/config';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { array: true })
  permissions: Permissions[];

  @OneToMany(() => User, user => user.role, { onDelete: 'SET NULL' })
  users: User[];
}
