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
        const host = (settings['smtp_host'] || process.env.SMTP_HOST) as string;
        const port = Number(settings['smtp_port'] || process.env.SMTP_PORT || 587);
        const user = (settings['smtp_user'] || process.env.SMTP_USER) as string;
        const pass = (settings['smtp_pass'] || process.env.SMTP_PASS) as string;
        const secure = (settings['smtp_secure'] === 'true') || (process.env.SMTP_SECURE === 'true');

        this.logger.debug(`SMTP Config: host=${host}, port=${port}, user=${user}, secure=${secure}`);

        if (!host || !user || !pass) {
            this.logger.warn('SMTP settings are missing in both DB and Environment. Email sending disabled.');
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
                this.logger.warn(`Email to ${to} not sent: SMTP is not configured.`);
                return false;
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
