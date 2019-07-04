/**
 * App constants
 */
const UserRoles = {
  Admin: 'Administrator'
}

const ProjectRoles = {
  Manager: 'Manager',
  Copilot: 'Copilot',
  Observer: 'Observer',
  Reviewer: 'Reviewer',
  Submitter: 'Submitter',
  Client_Manager: 'Client Manager',
  Iterative_Reviewer: 'Iterative Reviewer'
}

const xHeaders = {
  maxPerPage: 100,
  xTotalPages: 'x-total-pages'
}

const SystemReviewers = {
  Default: 'TC System'
}

module.exports = {
  UserRoles,
  ProjectRoles,
  xHeaders,
  SystemReviewers
}
