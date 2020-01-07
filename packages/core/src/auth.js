const credentialsExpected = process.env.CREDENTIALS || 'guest:guest'

module.exports = (req, cb) => {
  if (req.headers.authorization) {
    const credentialsGiven = Buffer.from(
      req.headers.authorization.slice(6),
      'base64'
    ).toString()
    if (credentialsGiven === credentialsExpected) return cb(null)
  }
  cb(new Error('authorization needed'))
}
