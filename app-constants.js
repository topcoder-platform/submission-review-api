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
  Submitter: 'Submitter'
}

const xHeaders = {
  maxPerPage: 10,
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
