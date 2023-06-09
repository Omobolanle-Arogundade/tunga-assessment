const authMethods = {
 FACEBOOK: 'facebook',
 GOOGLE: 'google',
 LOCAL: 'local',
};

const sendOTPActions = {
 REGISTER: 'register',
 RESET_PASSWORD: 'reset-password',
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

const answersGroupBy = {
 FORM: 'form',
 PATIENT: 'patient',
 QUESTION: 'question',
};

module.exports = {
 authMethods,
 sendOTPActions,
 roles,
 socialActions,
 questionTypes,
 userStatus,
 formStatus,
 answersGroupBy,
};
