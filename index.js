var streamdata = require('streamdata.io-events')
var Pushable = require('pull-pushable')

function createSource (url, appToken, headers, privateKey) {
  var SSE = streamdata(url, appToken, headers, privateKey)
  var pushable = Pushable(true, function onEnd (err) {
    if (err) throw new Error(err)
    SSE.close()
    SSE.removeAllListeners()
  })

  SSE.on('data', function (data) {
    pushable.push(data)
  })

  SSE.on('end', function () {
    pushable.end()
  })

  SSE.on('error', function (err) {
    pushable.end(err)
  })

  return pushable.source
}

module.exports = createSource
