export const ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CLIENT: 'CLIENT'
};

export const ROLE_REDIRECTS = {
    [ROLES.ADMIN]: '/admin-dashboard',
    [ROLES.MANAGER]: '/manager-dashboard',
    [ROLES.CLIENT]: '/client-dashboard'
};