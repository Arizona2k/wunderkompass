// Offline tests need an actually unreachable origin, including speculative TCP
// connections that Chromium opened without sending an HTTP request. Node's
// server.close() alone waits for those sockets while the browser stays open.
export async function stopTestServer(server) {
 await new Promise((resolve,reject)=>{
  server.close(error=>error&&error.code!=='ERR_SERVER_NOT_RUNNING'?reject(error):resolve());
  // Stop accepting first, then close connections; otherwise a new connection
  // could be accepted between these two operations. No shared app server here.
  server.closeAllConnections();
 });
}
