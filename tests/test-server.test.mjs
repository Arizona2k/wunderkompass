import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import {once} from 'node:events';
import {setImmediate} from 'node:timers/promises';
import {stopTestServer} from './browser/stop-test-server.mjs';

test('offline fixture stops even with an unused browser preconnection, then remains unreachable',async()=>{
 const server=http.createServer((_req,res)=>res.end('online'));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port,accepted=once(server,'connection');
 const client=net.connect({host:'127.0.0.1',port});
 const clientClosed=once(client,'close');
 try{
  const [socket]=await accepted;
  assert.equal(socket.bytesRead,0);
  let closed=false;
  const oldClose=new Promise(resolve=>server.close(()=>{closed=true;resolve();}));
  await setImmediate();
  assert.equal(server.listening,false);
  assert.equal(closed,false,'old shutdown is blocked by the real unused TCP connection');
  await stopTestServer(server);
  await oldClose;await clientClosed;
  assert.equal(closed,true);
  await assert.rejects(fetch('http://127.0.0.1:'+port+'/',{signal:AbortSignal.timeout(2000)}));
  await stopTestServer(server); // Cleanup is safe after an earlier offline stop.
 }finally{client.destroy();await stopTestServer(server);}
});
