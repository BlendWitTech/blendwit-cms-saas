import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private settingsService: SettingsService) { }

    private async createTransporter() {
        const settings = await this.settingsService.findAll();
        const host = settings['smtp_host'] as string;
        const port = Number(settings['smtp_port']);
        const user = settings['smtp_user'] as string;
        const pass = settings['smtp_pass'] as string;
        const secure = settings['smtp_secure'] === 'true';

        if (!host || !user || !pass) {
            this.logger.warn('SMTP settings are missing. Email sending disabled.');
            return null;
        }

        return nodemailer.createTransport({
            host,
            port: port || 587,
            secure, // true for 465, false for other ports
            auth: {
                user,
                pass,
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const transporter = await this.createTransporter();
            if (!transporter) {
                // Fallback: Log to console in development
                if (process.env.NODE_ENV === 'development') {
                    this.logger.warn('SMTP not configured. Logging email to console (DEV MODE):');
                    // In production, use transport.sendMail
                    // For now, we'll keep the mock silent or use a proper logger
                    return true;
                } else {
                    this.logger.error('SMTP settings missing in PRODUCTION. Email not sent.');
                    return false;
                }
            }

            const settings = await this.settingsService.findAll();
            const from = settings['smtp_from'] || settings['smtp_user'];

            const info = await transporter.sendMail({
                from: `"Blendwit CMS" <${from}>`,
                to,
                subject,
                html,
            });

            this.logger.log(`Email sent to ${to}: ${info.messageId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error.stack);
            return false;
        }
    }
}
