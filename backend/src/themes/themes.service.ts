import { Injectable, BadRequestException } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { MenusService } from '../menus/menus.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectCategoriesService } from '../project-categories/project-categories.service';
import { TestimonialsService } from '../testimonials/testimonials.service';
import { TeamService } from '../team/team.service';
import { ServicesService } from '../services/services.service';
import { TimelineService } from '../timeline/timeline.service';
import { PagesService } from '../pages/pages.service';

@Injectable()
export class ThemesService {
    private readonly uploadPath = path.join(process.cwd(), 'uploads', 'themes');

    constructor(
        private prisma: PrismaService,
        private menusService: MenusService,
        private projectsService: ProjectsService,
        private projectCategoriesService: ProjectCategoriesService,
        private testimonialsService: TestimonialsService,
        private teamService: TeamService,
        private servicesService: ServicesService,
        private timelineService: TimelineService,
        private pagesService: PagesService,
    ) {
        this.ensureUploadPath();
    }

    private ensureUploadPath() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async processThemeUpload(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (file.mimetype !== 'application/zip' && file.mimetype !== 'application/x-zip-compressed') {
            throw new BadRequestException('Only zip files are allowed');
        }

        const themeName = path.parse(file.originalname).name;
        const extractPath = path.join(this.uploadPath, themeName);

        try {
            const zip = new AdmZip(file.buffer);
            zip.extractAllTo(extractPath, true);

            return {
                message: 'Theme uploaded and extracted successfully',
                themeName: themeName,
                path: extractPath
            };

        } catch (error) {
            throw new BadRequestException(`Failed to extract theme: ${error.message}`);
        }
    }

    async listThemes() {
        // TODO: Implement listing logic by reading directories in uploadPath
        if (!fs.existsSync(this.uploadPath)) {
            return [];
        }

        const themes = fs.readdirSync(this.uploadPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        return themes;
    }

    async setupTheme(themeName: string) {
        const themePath = path.join(this.uploadPath, themeName);
        if (!fs.existsSync(themePath)) {
            throw new BadRequestException(`Theme ${themeName} not found`);
        }

        const configPath = path.join(themePath, 'theme.json');
        if (!fs.existsSync(configPath)) {
            throw new BadRequestException(`Theme ${themeName} is missing theme.json`);
        }

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            const results = {
                pages: await this.setupPages(config.pages || []),
                menus: await this.setupMenus(config.menus || []),
                categories: await this.setupProjectCategories(config.projectCategories || []),
                projects: await this.setupProjects(config.projects || []),
                team: await this.setupTeam(config.team || []),
                testimonials: await this.setupTestimonials(config.testimonials || []),
                services: await this.setupServices(config.services || []),
                milestones: await this.setupMilestones(config.milestones || []),
            };

            return {
                message: `Theme ${themeName} setup completed`,
                results
            };

        } catch (error) {
            throw new BadRequestException(`Failed to setup theme: ${error.message}`);
        }
    }

    private async setupPages(pages: any[]) {
        const results: any[] = [];
        for (const pageConfig of pages) {
            const slug = pageConfig.slug || pageConfig.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const page = await this.prisma.page.upsert({
                where: { slug },
                update: {
                    title: pageConfig.title,
                    description: pageConfig.description || '',
                    content: pageConfig.content || '',
                    status: 'PUBLISHED',
                },
                create: {
                    title: pageConfig.title,
                    slug: slug,
                    description: pageConfig.description || '',
                    content: pageConfig.content || '',
                    status: 'PUBLISHED',
                },
            });
            results.push(page);
        }
        return results.length;
    }

    private async setupMenus(menus: any[]) {
        for (const menuConfig of menus) {
            const { items, ...menuData } = menuConfig;

            const existing = await this.prisma.menu.findUnique({ where: { slug: menuConfig.slug } });
            if (existing) {
                await this.menusService.update(existing.id, menuConfig);
            } else {
                await this.menusService.create(menuConfig);
            }
        }
        return menus.length;
    }

    private async setupProjectCategories(categories: any[]) {
        for (const cat of categories) {
            const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            await this.prisma.projectCategory.upsert({
                where: { slug },
                update: cat,
                create: { ...cat, slug }
            });
        }
        return categories.length;
    }

    private async setupProjects(projects: any[]) {
        for (const proj of projects) {
            const slug = proj.slug || proj.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const existing = await this.prisma.project.findUnique({ where: { slug } });

            if (existing) {
                await this.projectsService.update(existing.id, proj);
            } else {
                await this.projectsService.create(proj);
            }
        }
        return projects.length;
    }

    private async setupTeam(team: any[]) {
        // Simple wipe and reload for team to maintain order if provided, 
        // or we could use order field. Let's use upsert if name matches? 
        // Better: wipe existing or just add. For demo, wipe is risky.
        // Let's use name as identifier for demo setup.
        for (const member of team) {
            const existing = await this.prisma.teamMember.findFirst({ where: { name: member.name } });
            if (existing) {
                await this.teamService.update(existing.id, member);
            } else {
                await this.teamService.create(member);
            }
        }
        return team.length;
    }

    private async setupTestimonials(testimonials: any[]) {
        for (const t of testimonials) {
            const existing = await this.prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
            if (existing) {
                await this.testimonialsService.update(existing.id, t);
            } else {
                await this.testimonialsService.create(t);
            }
        }
        return testimonials.length;
    }

    private async setupServices(services: any[]) {
        for (const s of services) {
            const existing = await this.prisma.service.findFirst({ where: { title: s.title } });
            if (existing) {
                await this.servicesService.update(existing.id, s);
            } else {
                await this.servicesService.create(s);
            }
        }
        return services.length;
    }

    private async setupMilestones(milestones: any[]) {
        for (const m of milestones) {
            const existing = await this.prisma.milestone.findFirst({ where: { title: m.title } });
            if (existing) {
                await this.timelineService.update(existing.id, m);
            } else {
                await this.timelineService.create(m);
            }
        }
        return milestones.length;
    }

    async setActiveTheme(themeName: string) {
        // Verify theme exists
        const themePath = path.join(this.uploadPath, themeName);
        if (!fs.existsSync(themePath)) {
            throw new BadRequestException(`Theme ${themeName} not found`);
        }

        await this.prisma.setting.upsert({
            where: { key: 'active_theme' },
            create: { key: 'active_theme', value: themeName },
            update: { value: themeName }
        });

        // Trigger setup automatically when activating if needed, 
        // or just set the flag. For now, let's just set the flag.
        return { message: `Theme ${themeName} is now active` };
    }

    async getActiveTheme() {
        const setting = await this.prisma.setting.findUnique({
            where: { key: 'active_theme' }
        });
        return setting ? setting.value : null;
    }
}
