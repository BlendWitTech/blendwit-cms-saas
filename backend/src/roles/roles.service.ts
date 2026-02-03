import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(createRoleDto: any) {
        const { name, icon, level, ...permissions } = createRoleDto;
        return (this.prisma as any).role.create({
            data: {
                name,
                icon,
                level: level || 10,
                permissions: permissions as any,
            },
        });
    }

    async findAll() {
        return (this.prisma as any).role.findMany({
            include: { users: { select: { id: true } } },
            orderBy: [{ level: 'asc' }, { name: 'asc' }],
        });
    }

    async findOne(id: string) {
        return (this.prisma as any).role.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateRoleDto: any) {
        const { name, icon, level, ...permissions } = updateRoleDto;

        const currentRole = await (this.prisma as any).role.findUnique({ where: { id } });
        if (!currentRole) throw new BadRequestException('Role not found.');

        // Protect core roles from renaming or level changes
        if (currentRole.name === 'Super Admin' || currentRole.name === 'Admin') {
            if (name && name !== currentRole.name) {
                throw new BadRequestException('Cannot rename system roles.');
            }
            if (level !== undefined && level !== currentRole.level) {
                throw new BadRequestException('Cannot change level of system roles.');
            }
        }

        const data: any = {};
        if (name) data.name = name;
        if (icon) data.icon = icon;
        if (level !== undefined) data.level = level;
        if (Object.keys(permissions).length > 0) data.permissions = permissions;

        return (this.prisma as any).role.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        const role = await (this.prisma as any).role.findUnique({
            where: { id },
            include: { users: true },
        });

        if (role && role.users.length > 0) {
            throw new BadRequestException('Cannot delete role that is assigned to users.');
        }

        return (this.prisma as any).role.delete({
            where: { id },
        });
    }
}
