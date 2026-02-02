import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsString()
    @IsOptional()
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

    @IsOptional()
    categories?: string[];

    @IsOptional()
    tags?: string[];

    @IsOptional()
    publishedAt?: Date | string;

    @IsOptional()
    seo?: {
        title: string;
        description: string;
    };
}
