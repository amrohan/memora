import { IsIn, IsOptional, IsString } from 'class-validator';
import { Theme } from '../../../app/core/services/theme.service';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsString()
  @IsIn([
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 
    'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 
    'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 
    'business', 'acid', 'lemonade', 'night', 'coffee', 'winter'
  ])
  theme?: Theme;
}
