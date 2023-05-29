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
];

export const permissions = adminPermissions.map((permission) => permission.name);

export default adminPermissions;
