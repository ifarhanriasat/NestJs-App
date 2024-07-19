// src/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Gadgets } from '../../gedgets/entities/gedget.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  phone: string;
  
  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  e_verified: Boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @UpdateDateColumn({ type: 'timestamp' })
  lastModified: Date;

  @OneToMany(() => Gadgets, gadget => gadget.user)
  gadgets: Gadgets[];

  @Column({ type: 'varchar', default: 'standard' })
  origin: string;

  @BeforeInsert()
  createVerificationToken() {
    this.verificationToken = uuidv4();
  }
  
}
