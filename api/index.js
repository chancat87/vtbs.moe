const spider = require('./spider')
const vtbs = require('./vtbs')

const ant = require('./ant')

const http = require('http')
const Server = require('socket.io')

const { monster, vd, vdSocket, falcon, hawk } = require('./interface')

const snake = require('./snake')
const { worm, wormResult } = require('./worm')

const { connect } = require('./socket')
const httpAPI = require('./http')

const { init } = require('./database')

const PARALLEL = 3
const INTERVAL = 1000 * 60 * 5

;
(async () => {
  let { site, num, info, active, live, guard, macro, fullGuard, guardType } = await init()
  const io = new Server({ serveClient: false })
  const server = http.createServer(httpAPI({ vtbs, info, fullGuard, monster, active, live }))
  io.attach(server)
  vd.attach(server)
  spider({ PARALLEL, INTERVAL, vtbs, db: { site, info, active, guard, guardType }, io, worm, falcon })
  snake({ vdSocket, io, info })
  hawk({ io })
  setTimeout(() => {
    ant({ vtbs, macro, num, info, fullGuard, guardType, INTERVAL, io })
  }, 1000 * 60 * 4)
  io.on('connection', connect({ io, vtbs, macro, site, num, info, active, falcon, guard, fullGuard, guardType, PARALLEL, INTERVAL, wormResult }))
  server.listen(8001)
})()
