import express from 'express';

import { execFile } from 'child_process'
import { Readable } from 'stream'
import * as FSE from 'fs-extra'

const app = express();
app.use(express.json())

const PORT = 9195;

type Callable = { (...args: any[]): any }

app.get('/', (req, res) => {
  res.send('OK')
});

// run git command based on JSON body
app.post('/git', (req, res) => {
  const payload = req.body
  const stdin = payload.options?.stdin

  console.log(payload)

  const spawnedProcess = execFile('git', payload.args, payload.options, (error, stdout, stderr) => {
    // send response
    res.json({
      error: error,
      stdout: stdout,
      stderr: stderr
    })
  })
  if (stdin) {
    const stdinStream = new Readable()
    stdinStream.push(stdin)
    stdinStream.push(null)
    if (spawnedProcess.stdin) {
      stdinStream.pipe(spawnedProcess.stdin)
    }
  }
});

// run fs-extra command based on JSON body
app.post('/fse', (req, res) => {
  const payload = req.body
  const fn = payload.function
  const args = payload.args
  const options = payload.options

  // @ts-ignore this is a hack
  const result = FSE[fn](...args)

  result.then( (result: any) => res.json({ result: result }) )
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
