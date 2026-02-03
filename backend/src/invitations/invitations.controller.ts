import { Controller, Post, Get, Body, Delete, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IpGuard } from '../auth/ip.guard';

@UseGuards(JwtAuthGuard, IpGuard)
@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    async create(@Body() data: { email: string; role: string; ips: string[] }) {
        try {
            return await this.invitationsService.createInvitation({
                email: data.email,
                roleId: data.role,
                ipWhitelist: data.ips,
            });
        } catch (error: any) {
            throw new BadRequestException(error.message || 'Failed to process invitation');
        }
    }

    @Get()
    async findAll() {
        return this.invitationsService.getInvitations();
    }

    @Delete(':id')
    async revoke(@Param('id') id: string) {
        return this.invitationsService.revokeInvitation(id);
    }
}
