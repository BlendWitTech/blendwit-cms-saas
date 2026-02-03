import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) { }

    async create(createTeamMemberDto: any) {
        return this.prisma.teamMember.create({
            data: createTeamMemberDto,
        });
    }

    async findAll() {
        return this.prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.teamMember.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateTeamMemberDto: any) {
        return this.prisma.teamMember.update({
            where: { id },
            data: updateTeamMemberDto,
        });
    }

    async remove(id: string) {
        return this.prisma.teamMember.delete({
            where: { id },
        });
    }

    async reorder(updates: Array<{ id: string; order: number }>) {
        const promises = updates.map(({ id, order }) =>
            this.prisma.teamMember.update({
                where: { id },
                data: { order },
            })
        );
        return Promise.all(promises);
    }
}
