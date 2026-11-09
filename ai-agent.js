/* €Trillion — AI Assistant Widget */
(function() {
    const knowledgeBase = [
        {
            keywords: ['buy', 'purchase', 'how to buy', 'купить'],
            answer: `You can buy **€Trillion (€T)** in several ways:<br><br>
            💳 <b>Card / OpenSea:</b> <a href="https://opensea.io/token/solana/BswcV7FaiFL9EoBUzvDLwFcaUf2puxEymSH9Q2Q6RWKn" target="_blank">Buy on OpenSea</a><br>
            🔄 <b>Jupiter Swap:</b> <a href="https://jup.ag/swap/SOL-BswcV7FaiFL9EoBUzvDLwFcaUf2puxEymSH9Q2Q6RWKn" target="_blank">Swap on Jupiter</a><br>
            🟡 <b>Binance Web3:</b> <a href="https://app.binance.com/uni-qr/web3-token-details?tokenCA=BswcV7FaiFL9EoBUzvDLwFcaUf2puxEymSH9Q2Q6RWKn&binanceChainId=CT_501&chain=sol" target="_blank">Trade on Binance</a>`
        },
        {
            keywords: ['price', 'cost', 'цена', 'target'],
            answer: `The launch price is **$0.001**. The target is **×1000**.<br><br>Check live data on <a href="https://www.geckoterminal.com/solana/pools/6S8ZGfJG1xtt8y4xrXJC7vmGmt2s6qBL21e5aRe4Vru2" target="_blank">GeckoTerminal</a>.`
        },
        {
            keywords: ['contract', 'address', 'контракт'],
            answer: `The official contract address for €Trillion is:<br><br><code style="background:#1A1E41; padding:4px 8px; border-radius:4px; font-size:11px; word-break:break-all; color:#FFD700;">BswcV7FaiFL9EoBUzvDLwFcaUf2puxEymSH9Q2Q6RWKn</code><br><br><a href="https://solscan.io/token/BswcV7FaiFL9EoBUzvDLwFcaUf2puxEymSH9Q2Q6RWKn" target="_blank">🔍 Verify on Solscan</a>`
        },
        {
            keywords: ['technology', 'zk', 'ai', 'vesting', 'token-2022'],
            answer: `€Trillion uses **Token-2022** with exclusive features: Native Vesting (investor protection), Transfer Hooks (KYC compliance), and AI Treasury (yield optimization). <a href="technology.html">Read more on the Technology page</a>.`
        },
        {
            keywords: ['ecosystem', 'what is', 'about', 'экосистема'],
            answer: `**€Trillion** is the ultimate flagship token of the 123 Network, which includes 40+ tokens across aviation, banking, and retail. <a href="ecosystem.html">View the full Ecosystem Map</a>.`
        }
    ];

    const widgetHTML = `
        <style>
            #ai-agent-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                width: 60px; height: 60px; border-radius: 50%;
                background: #FFD700; color: #0A0E27; border: 2px solid #FFA500;
                font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(255, 215, 0, 0.6);
                transition: 0.3s; display: flex; align-items: center; justify-content: center;
            }
            #ai-agent-btn:hover { transform: scale(1.1); background: #FFA500; }
            #ai-agent-window {
                position: fixed; bottom: 90px; right: 20px; z-index: 9999;
                width: 350px; max-width: calc(100vw - 40px);
                background: #0A0E27; border: 1px solid #FFD700; border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                display: none; flex-direction: column; overflow: hidden;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            #ai-agent-window.open { display: flex; }
            #ai-header {
                background: #1A1E41; padding: 12px 16px; border-bottom: 1px solid #FFD700;
                display: flex; justify-content: space-between; align-items: center;
            }
            #ai-header h3 { margin: 0; font-size: 15px; color: #fff; display: flex; align-items: center; gap: 8px; }
            #ai-header h3 span { color: #FFD700; }
            #ai-close { background: transparent; border: none; color: #8A94C8; font-size: 20px; cursor: pointer; }
            #ai-messages { padding: 16px; height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .ai-msg { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; max-width: 90%; word-wrap: break-word; }
            .ai-msg.bot { background: #1A1E41; color: #E0E6FF; align-self: flex-start; border-bottom-left-radius: 4px; }
            .ai-msg.user { background: #FFD700; color: #0A0E27; align-self: flex-end; border-bottom-right-radius: 4px; }
            .ai-msg a { color: #FFD700; text-decoration: underline; }
            #ai-input-area { display: flex; padding: 12px; border-top: 1px solid #FFD700; background: #060920; }
            #ai-input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #1E2350; background: #0A0E27; color: #fff; outline: none; font-size: 13px; }
            #ai-input:focus { border-color: #FFD700; }
            #ai-send { margin-left: 8px; padding: 0 16px; background: #FFD700; color: #0A0E27; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
            #ai-send:hover { background: #FFA500; }
            #ai-suggestions { padding: 0 16px 12px; display: flex; gap: 6px; flex-wrap: wrap; background: #060920; }
            .ai-chip { background: rgba(255, 215, 0, 0.1); color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.3); padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; transition: 0.2s; }
            .ai-chip:hover { background: #FFD700; color: #0A0E27; }
            @media (max-width: 480px) { #ai-agent-window { width: calc(100vw - 40px); bottom: 80px; } #ai-messages { height: 250px; } }
        </style>
        <button id="ai-agent-btn" title="Ask AI">🤖</button>
        <div id="ai-agent-window">
            <div id="ai-header">
                <h3>🤖 <span>€Trillion</span> AI</h3>
                <button id="ai-close">×</button>
            </div>
            <div id="ai-messages">
                <div class="ai-msg bot">Hello! I am the <b>€Trillion</b> AI Assistant. Ask me about the technology, price, or ecosystem.</div>
            </div>
            <div id="ai-suggestions">
                <span class="ai-chip" data-q="How to buy?">How to buy?</span>
                <span class="ai-chip" data-q="What is the price?">Price</span>
                <span class="ai-chip" data-q="Technology">Technology</span>
            </div>
            <div id="ai-input-area">
                <input type="text" id="ai-input" placeholder="Ask me anything..." autocomplete="off" />
                <button id="ai-send">➤</button>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container);
        const btn = document.getElementById('ai-agent-btn');
        const win = document.getElementById('ai-agent-window');
        const closeBtn = document.getElementById('ai-close');
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const messages = document.getElementById('ai-messages');
        const chips = document.querySelectorAll('.ai-chip');

        btn.addEventListener('click', () => { win.classList.toggle('open'); if (win.classList.contains('open')) input.focus(); });
        closeBtn.addEventListener('click', () => win.classList.remove('open'));

        function sendMessage(text) {
            if (!text.trim()) return;
            const userMsg = document.createElement('div');
            userMsg.className = 'ai-msg user';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            messages.scrollTop = messages.scrollHeight;
            input.value = '';
            const typing = document.createElement('div');
            typing.className = 'ai-msg bot';
            typing.textContent = '...';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                typing.remove();
                const query = text.toLowerCase();
                let bestMatch = null;
                for (let item of knowledgeBase) {
                    if (item.keywords.some(k => query.includes(k))) { bestMatch = item.answer; break; }
                }
                const botMsg = document.createElement('div');
                botMsg.className = 'ai-msg bot';
                botMsg.innerHTML = bestMatch || `I'm not sure. Check the <a href="ecosystem.html">Ecosystem Map</a> or ask about price, tech, or how to buy.`;
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 500);
        }

        sendBtn.addEventListener('click', () => sendMessage(input.value));
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(input.value); });
        chips.forEach(chip => chip.addEventListener('click', () => sendMessage(chip.dataset.q)));
    });
})();
