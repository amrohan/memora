import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theme } from '../../../app/core/services/theme.service';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ 
    type: 'enum',
    enum: [
      'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 
      'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 
      'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 
      'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 
      'business', 'acid', 'lemonade', 'night', 'coffee', 'winter'
    ],
    default: 'light',
    nullable: true 
  })
  theme: Theme;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
