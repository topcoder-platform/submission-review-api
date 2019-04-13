/**
 * Controller for submission artifact endpoints
 */
const service = require('../services/ArtifactService')
const { getM2Mtoken } = require('../common/helper')
const request = require('superagent')

/**
 * Get submission artifacts
 * @param req the request
 * @param res the response
 */
async function getSubmissionArtifacts (req, res) {
  const result = await service.getSubmissionArtifacts(req.authUser, req.params.submissionId)
  res.send(result)
}

/**
 * Download artifact of the submission
 * @param req the request
 * @param res the response
 */
async function downloadArtifact (req, res) {
  const url = await service.getArtifactDownloadUrl(req.authUser, req.params.submissionId, req.params.artifactId)
  const token = await getM2Mtoken()
  request
    .get(url)
    .set('Authorization', `Bearer ${token}`)
    .on('response', remoteRes => {
      res.set('Content-Disposition', remoteRes.headers['content-disposition'])
    })
    .pipe(res)
}

module.exports = {
  getSubmissionArtifacts,
  downloadArtifact
}
