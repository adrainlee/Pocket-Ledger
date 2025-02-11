const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Configure URL handling before starting Next.js
global.URL = require('whatwg-url').URL
global.URLSearchParams = require('whatwg-url').URLSearchParams

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`)
  })
})
