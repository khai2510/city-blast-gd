// minimal headless-Chrome driver over the DevTools protocol (no npm deps): launch, open a URL, evaluate JS.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // Linux VM: CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
export async function launch(port = 9333){
  const dir = mkdtempSync(join(tmpdir(), 'cb-headless-'));
  const p = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=430,932', '--autoplay-policy=no-user-gesture-required', '--mute-audio', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  for(let i = 0; i < 60; i++){ try{ await fetch(`http://127.0.0.1:${port}/json/version`); break; }catch(e){ await new Promise(r => setTimeout(r, 250)); } }
  return { proc: p, port };
}
export async function open(port, url){
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map(), logs = [];
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if(m.id && pend.has(m.id)){ pend.get(m.id)(m); pend.delete(m.id); }
    else if(m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push(m.params.args.map(a => a.value || a.description).join(' ')); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable');
  const evaluate = async (expr, timeoutMs = 600000) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: timeoutMs });
    if(r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600));
    return r.result && r.result.result ? r.result.result.value : undefined;
  };
  const shot = async () => (await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 })).result.data;
  return { send, evaluate, shot, logs, close: () => ws.close() };
}
