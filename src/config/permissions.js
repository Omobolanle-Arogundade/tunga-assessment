const adminPermissions = [
 {
  name: 'admin_settings',
  description: 'Admin Settings',
 },
 {
  name: 'questions',
  description: 'Questions Settings',
 },
 {
  name: 'forms',
  description: 'Manage Forms',
 },
 {
  name: 'answers',
  description: 'View Answers',
 },
];

export const permissions = adminPermissions.map((permission) => permission.name);

export default adminPermissions;
