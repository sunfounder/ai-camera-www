
const protocol = window.location.protocol;
const ip = window.location.hostname;
// const ip = '192.168.4.1';
// const ip = window.location.hostname + ':3001';
let _host = `${protocol}//${ip}`;

const HOST = _host;
export { HOST }