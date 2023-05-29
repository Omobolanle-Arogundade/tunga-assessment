const authMethods = {
 FACEBOOK: 'facebook',
 GOOGLE: 'google',
 LOCAL: 'local',
};

const userStatus = {
 ACTIVE: 'ACTIVE',
 PENDING: 'PENDING',
 INACTIVE: 'INACTIVE',
 SUSPENDED: 'SUSPENDED',
};

const roles = {
 ADMIN: 'admin',
 PATIENT: 'patient',
};

const socialActions = {
 LOGIN: 'login',
 SIGNUP: 'signup',
};

const questionTypes = ['multi-choice', 'text', 'file'];

const formStatus = {
 PENDING: 'PENDING',
 COMPLETED: 'COMPLETED',
};

module.exports = {
 authMethods,
 roles,
 socialActions,
 questionTypes,
 userStatus,
 formStatus,
};
