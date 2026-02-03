import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitationsService {
    private readonly logger = new Logger(InvitationsService.name);

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

        this.logger.log(`Creating invitation for ${data.email} with role ${data.roleId}`);
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

        const mailResult = await this.mailService.sendMail(data.email, 'Invitation to Blendwit CMS', html);
        if (!mailResult) {
            this.logger.error(`Failed to send invitation email to ${data.email}. However, the invitation record was created.`);
        } else {
            this.logger.log(`Invitation email successfully sent to ${data.email}`);
        }

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
