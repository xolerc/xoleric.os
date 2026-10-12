// === index.html dan ajratildi (XOLERIC SEO) ===
/**
     * SYSTEM CONFIG
     */
    const Themes = [
        { hue: 120, name: "Matrix Green" },
        { hue: 300, name: "Cyberpunk Pink" },
        { hue: 45, name: "Golden State" },
        { hue: 190, name: "Ice Blue" },
        { hue: 0, name: "Red Alert" }
    ];
    let themeIdx = 0;

    // --- MATRIX ENGINE ---
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    let width, height, columns = [];
    const fontSize = 14;

    function initMatrix() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        const colCount = Math.floor(width / fontSize);
        columns = [];
        for(let i=0; i<colCount; i++) columns.push({x: i*fontSize, y: Math.random()*-1000, s: 1+Math.random()*3});
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary');
        ctx.font = 'bold '+fontSize+'px monospace';
        columns.forEach(c => {
            const char = "01XY" + String.fromCharCode(0x30A0 + Math.random()*96);
            ctx.fillText(char.charAt(Math.floor(Math.random()*char.length)), c.x, c.y);
            if(c.y > height && Math.random()>0.98) c.y = -50;
            c.y += c.s;
        });
        requestAnimationFrame(drawMatrix);
    }

    // --- TERMINAL ENGINE ---
    const output = document.getElementById('output');
    const input = document.getElementById('cmd-input');
    const terminal = document.getElementById('terminal-ui');

    function print(html, type="sys-msg") {
        const div = document.createElement('div');
        div.className = type;
        div.innerHTML = html;
        output.appendChild(div);
        terminal.scrollTo(0, terminal.scrollHeight);
    }

    function openPortal(url, deepLink) {
        print("Portal ochilmoqda...", "sys-info");
        const p = document.getElementById('portal');
        p.classList.add('portal-active');
        setTimeout(() => {
            p.classList.remove('portal-active');
            if(deepLink) {
                window.location.href = deepLink;
                setTimeout(() => window.location.href = url, 1000);
            } else {
                window.location.href = url;
            }
        }, 1000);
    }

    // --- COMMANDS ---
    const Commands = {
        'help': () => {
            print("--- MAVJUD BUYRUQLAR ---", "sys-success");
            print("* social: telegram, instagram, github");
            print("* tizim: clear, date, theme, status");
            print("* Yoki shunchaki AI bilan gaplashing!");
        },
        'clear': () => output.innerHTML = '',
        'telegram': () => openPortal('https://t.me/neoorg', 'tg://resolve?domain=neoorg'),
        'instagram': () => openPortal('https://instagram.com/cvant23', 'instagram://user?username=cvant23'),
        'github': () => openPortal('https://github.com/xolericuz'),
        'theme': () => {
            themeIdx = (themeIdx + 1) % Themes.length;
            document.documentElement.style.setProperty('--hue', Themes[themeIdx].hue);
            print(`Mavzu o'zgardi: ${Themes[themeIdx].name}`, "sys-success");
        },
        'status': () => print("Xoleric OS v4.0 | AI Modules: Loaded | Security: High", "sys-info")
    };

    // --- EVENT HANDLER ---
    input.addEventListener('keydown', e => {
        if(e.key === 'Enter') {
            const val = input.value.trim();
            if(!val) return;

            // Prompt tarixini chizish
            const history = `
                <div style="margin-top:8px; opacity:0.7; font-size:13px">
                    <span class="c-sym">╭──(</span><span class="c-user">neo@xoleric</span><span class="c-sym">)</span>
                    <span class="c-sym">╰┈➜</span> ${val}
                </div>`;
            print(history, "");
            
            input.value = '';
            const cmd = val.split(' ')[0].toLowerCase();

            // 1. Avval Buyruqlar tekshiriladi
            if(Commands[cmd]) {
                Commands[cmd]();
            } 
            // 2. Keyin AI tahlil qiladi (Matematika yoki Suhbat)
            else {
                // 'ai-core.js' dagi XolericAI obyekti ishlaydi
                if(typeof XolericAI !== 'undefined') {
                    const response = XolericAI.analyze(val);

                    
                    // Javobni harfma-harf yozish effekti
                    const aiDiv = document.createElement('div');
                    aiDiv.className = 'ai-response';
                    output.appendChild(aiDiv);
                    
                    let i = 0;
                    const typeWriter = setInterval(() => {
                        aiDiv.innerHTML += response.charAt(i);
                        terminal.scrollTo(0, terminal.scrollHeight);
                        i++;
                        if(i >= response.length) clearInterval(typeWriter);
                    }, 20); // Yozish tezligi

                } else {
                    print("Xatolik: AI Core fayli topilmadi!", "sys-err");
                }
            }
        }
    });

    // Theme Switcher (4-Tap)
    let taps = 0, tapTimer;
    document.body.addEventListener('click', () => {
        document.getElementById('cmd-input').focus();
        taps++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => taps=0, 800);
        if(taps === 4) Commands['theme']();
    });

    // Start
    window.onresize = initMatrix;
    initMatrix();
    drawMatrix();
    
    // Xush kelibsiz xabarini kechikib chiqarish (AI yuklangani bilinishi uchun)
    setTimeout(() => {
        if(typeof XolericAI !== 'undefined') {
            console.log("AI Core Loaded Successfully");
        }
    }, 1000);