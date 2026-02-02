import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsBoolean()
    @IsOptional()
    manage_content?: boolean;

    @IsBoolean()
    @IsOptional()
    manage_media?: boolean;

    @IsBoolean()
    @IsOptional()
    manage_users?: boolean;

    @IsBoolean()
    @IsOptional()
    manage_settings?: boolean;

    @IsBoolean()
    @IsOptional()
    all?: boolean;
}
