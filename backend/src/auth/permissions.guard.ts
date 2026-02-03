import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from './permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            return false;
        }

        // 1. Super Admin bypass (Database level or hardcoded name)
        if (user.role.name === 'Super Admin') {
            return true;
        }

        // 2. 'all' permission bypass (JSON field in DB)
        // Adjust this if your permissions JSON structure is different (e.g. array vs object)
        // Assuming permissions is an object: { users_view: true, ... }
        const userPermissions = user.role.permissions || {};

        if (userPermissions.all === true) {
            return true;
        }

        // 3. Check for specific permissions
        return requiredPermissions.some((permission) => userPermissions[permission] === true);
    }
}
