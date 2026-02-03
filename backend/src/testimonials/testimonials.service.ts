import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
    constructor(private prisma: PrismaService) { }

    async create(createTestimonialDto: any) {
        return this.prisma.testimonial.create({
            data: createTestimonialDto,
        });
    }

    async findAll() {
        return this.prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.testimonial.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateTestimonialDto: any) {
        return this.prisma.testimonial.update({
            where: { id },
            data: updateTestimonialDto,
        });
    }

    async remove(id: string) {
        return this.prisma.testimonial.delete({
            where: { id },
        });
    }

    async findFeatured(limit: number = 5) {
        return this.prisma.testimonial.findMany({
            where: { rating: { gte: 4 } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
