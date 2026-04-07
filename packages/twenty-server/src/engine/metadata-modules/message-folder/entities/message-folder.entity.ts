import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// TODO: upstream cherry-pick stub - module not yet in fork
@Entity({ name: 'messageFolder', schema: 'core' })
export class MessageFolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @Column({ nullable: true, type: 'uuid' })
  messageChannelId: string;

  @Column({ nullable: true })
  externalId: string;

  @Column({ nullable: true, type: 'uuid' })
  parentFolderId: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
