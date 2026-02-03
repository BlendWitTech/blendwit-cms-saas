import { IsString, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsInt()
    @IsOptional()
    @Min(0)
    level?: number;

    // Granular Permissions
    @IsBoolean() @IsOptional() users_view?: boolean;
    @IsBoolean() @IsOptional() users_create?: boolean;
    @IsBoolean() @IsOptional() users_edit?: boolean;
    @IsBoolean() @IsOptional() users_delete?: boolean;
    @IsBoolean() @IsOptional() users_deactivate?: boolean;
    @IsBoolean() @IsOptional() users_reactivate?: boolean;

    @IsBoolean() @IsOptional() roles_view?: boolean;
    @IsBoolean() @IsOptional() roles_create?: boolean;
    @IsBoolean() @IsOptional() roles_edit?: boolean;
    @IsBoolean() @IsOptional() roles_delete?: boolean;

    @IsBoolean() @IsOptional() content_view?: boolean;
    @IsBoolean() @IsOptional() content_create?: boolean;
    @IsBoolean() @IsOptional() content_edit?: boolean;
    @IsBoolean() @IsOptional() content_delete?: boolean;

    @IsBoolean() @IsOptional() media_view?: boolean;
    @IsBoolean() @IsOptional() media_upload?: boolean;
    @IsBoolean() @IsOptional() media_delete?: boolean;

    @IsBoolean() @IsOptional() settings_edit?: boolean;
    @IsBoolean() @IsOptional() audit_view?: boolean;
    @IsBoolean() @IsOptional() analytics_view?: boolean;
    @IsBoolean() @IsOptional() seo_manage?: boolean;

    @IsBoolean()
    @IsOptional()
    all?: boolean;
}
