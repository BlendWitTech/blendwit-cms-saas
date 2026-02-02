import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const settings = await (this.prisma as any).setting.findMany();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    async update(key: string, value: string) {
        return (this.prisma as any).setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async updateMany(settings: Record<string, string>) {
        const updates = Object.entries(settings).map(([key, value]) =>
            this.update(key, value),
        );
        return Promise.all(updates);
    }
}
