import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService
    ) { }

    async createInvitation(data: { email: string; roleId: string; ipWhitelist: string[] }) {
        const existing = await (this.prisma as any).invitation.findUnique({ where: { email: data.email } });
        if (existing && existing.status === 'PENDING') {
            throw new BadRequestException('An active invitation already exists for this email.');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours expiration

        const invitation = await (this.prisma as any).invitation.create({
            data: {
                email: data.email,
                roleId: data.roleId,
                ipWhitelist: data.ipWhitelist,
                token,
                expiresAt,
                status: 'PENDING',
            },
        });

        const inviteLink = `http://localhost:3000/register?token=${token}`;
        const html = `
            <h3>You have been invited to Blendwit CMS</h3>
            <p>Click the link below to accept your invitation and set up your account:</p>
            <a href="${inviteLink}">${inviteLink}</a>
            <p>This link expires in 48 hours.</p>
        `;

        // Don't wait for email, just log error if fails.
        this.mailService.sendMail(data.email, 'Invitation to Blendwit CMS', html);

        return invitation;
    }

    async getInvitations() {
        return (this.prisma as any).invitation.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async revokeInvitation(id: string) {
        return (this.prisma as any).invitation.update({
            where: { id },
            data: { status: 'REVOKED' },
        });
    }
}
