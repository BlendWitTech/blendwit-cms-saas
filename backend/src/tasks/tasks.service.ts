import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleProjectStatusUpdates() {
        this.logger.log('Running daily project status check...');

        const now = new Date();

        const projectsToUpdate = await (this.prisma as any).project.findMany({
            where: {
                status: 'IN_PROGRESS',
                completionDate: {
                    lte: now
                }
            }
        });

        if (projectsToUpdate.length === 0) {
            this.logger.log('No projects to update.');
            return;
        }

        for (const project of projectsToUpdate) {
            await (this.prisma as any).project.update({
                where: { id: project.id },
                data: { status: 'COMPLETED' }
            });

            await this.notificationsService.create({
                type: 'SUCCESS',
                title: 'Project Completed',
                message: `Project "${project.title}" has been automatically marked as COMPLETED based on its completion date.`,
                link: `/dashboard/projects?edit=${project.id}`,
                targetRole: 'Admin' // Adjust based on who should see this
            });

            this.logger.log(`Project "${project.title}" (${project.id}) marked as completed.`);
        }
    }
}
