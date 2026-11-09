/* €Trillion — Cross-page counter for 123 Network */
(function(){
  const SK = {
    counter:  'trillion_counter',
    visitors: 'trillion_visitors',
    holders:  'trillion_holders',
    clients:  'trillion_clients',
    startTime:'trillion_start',
    lastUpdate:'trillion_last',
    hash:     'trillion_hash'
  };
  const SALT = 'trillion_salt_2026_et_infinite';

  function genHash(v){
    let h = 0;
    const s = String(v) + SALT;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h &= h;
    }
    return Math.abs(h).toString(16).padStart(8, '0');
  }

  function save(v, h, c, s){
    const n = Date.now();
    const d = { visitors: v, holders: h, clients: c, startTime: s, lastUpdate: n, hash: genHash(v + '|' + h + '|' + c + '|' + s) };
    try {
      localStorage.setItem(SK.counter, JSON.stringify(d));
      localStorage.setItem(SK.visitors, String(v));
      localStorage.setItem(SK.holders, String(h));
      localStorage.setItem(SK.clients, String(c));
      localStorage.setItem(SK.startTime, String(s));
      localStorage.setItem(SK.lastUpdate, String(n));
      localStorage.setItem(SK.hash, d.hash);
      sessionStorage.setItem(SK.counter, JSON.stringify(d));
    } catch(e){}
  }

  function load(){
    try {
      const data = localStorage.getItem(SK.counter);
      if (data) {
        const p = JSON.parse(data);
        if (p.hash === genHash(p.visitors + '|' + p.holders + '|' + p.clients + '|' + p.startTime)) return p;
      }
      const sd = sessionStorage.getItem(SK.counter);
      if (sd) {
        const p = JSON.parse(sd);
        if (p.hash === genHash(p.visitors + '|' + p.holders + '|' + p.clients + '|' + p.startTime)) return p;
      }
    } catch(e){}
    return null;
  }

  let st = load();
  const now = Date.now();
  if (!st) {
    // Стартовые значения для €Trillion
    st = { visitors: 8888888, holders: 2, clients: 0, startTime: now, lastUpdate: now, hash: genHash(8888888 + '|' + 2 + '|' + 0 + '|' + now) };
    save(st.visitors, st.holders, st.clients, st.startTime);
  }

  let visitors = st.visitors;
  let holders  = st.holders;
  let clients  = st.clients;
  const startTime = st.startTime;

  function updateCounter(){
    const n = Date.now();
    const elapsed = Math.floor((n - startTime) / 1000);
    
    // Скорость роста для €Trillion
    visitors = 8888888 + elapsed * 10;
    holders  = 2 + Math.floor(elapsed / 120);
    clients  = 0 + Math.floor(elapsed / 240);

    document.querySelectorAll('.counter-visitors').forEach(el => el.textContent = visitors.toLocaleString());
    document.querySelectorAll('.counter-holders').forEach(el => el.textContent = holders.toLocaleString());
    document.querySelectorAll('.counter-clients').forEach(el => el.textContent = clients.toLocaleString());

    const ts = new Date(n).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    document.querySelectorAll('.counter-visitor-time').forEach(el => el.textContent = 'Updated: ' + ts);

    if (n - st.lastUpdate > 10000) {
      save(visitors, holders, clients, startTime);
      st.lastUpdate = n;
    }
  }

  window.addEventListener('storage', function(e){
    if (e.key === SK.visitors) {
      const nv = parseInt(e.newValue);
      if (nv > visitors) { visitors = nv; updateCounter(); }
    }
  });

  window.addEventListener('beforeunload', function(){ save(visitors, holders, clients, startTime); });

  updateCounter();
  setInterval(updateCounter, 1000);
})();
