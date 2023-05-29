import config from '../../config';

const { permissions } = require('../../config/permissions');
const { roles, authMethods } = require('../../utils/constants');

const admin = {
 email: 'primaryadmin@test.com',
 mobile: '+234123456789',
 fullName: 'Primary Admin',
 password: config.admin.password,
 role: roles.ADMIN,
 authMethods: [authMethods.LOCAL],
 permissions,
};

export default admin;
