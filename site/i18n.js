/* Language packs. English lives in index.html; these override [data-i18n] nodes.
   Missing keys fall back to the original English. Values keep whatever inline
   markup the English node had (<span class="serif">). */

window.I18N = {
  zh: {
    "nav.evolution": "演化",
    "nav.agent": "智能体",
    "nav.sui": "Sui",
    "nav.sources": "资料",
    "nav.slides": "幻灯片",

    "deck.hint": "方向键，或滑动 →",
    "contents.kicker": "目录",
    "contents.01": "软件的演化",
    "contents.02": "构建一个智能体",
    "contents.03": "Sui 上的智能体钱包",
    "evo.fourhead": "四层，一条演化线。",
    "agent.whathead": "什么是智能体？",
    "agent.run.head": "把它跑起来",
    "sui.flowhead": "从请求到链上动作",

    "hero.eyebrow": "Sui Basecamp 2026 · 新加坡滨海湾金沙 · 10 月 7–8 日",
    "hero.title": "Agentic Workshop",
    "hero.tagline": "从二进制到智能体——软件是怎样构建的，以及 AI 会把它带向何方。",
    "hero.lede": "四层抽象，每一层都建立在下一层之上，最后落在一个新的地方：一个你可以对话的程序，它会推理、决策，并亲自签署交易。本页把整条路走一遍。",
    "hero.cta1": "开始巡览",
    "hero.cta2": "下载幻灯片",
    "hero.cta3": "资料来源",

    "hands.kicker": "开始之前",
    "hands.head": "先举个手。",
    "hands.sub": "没有标准答案——这只是决定这次巡览对你从哪儿开始。点选适用的项。",
    "hands.h1": "我现在会用 vibe-coding",
    "hands.h2": "我会一门高级语言（Python、JS……）",
    "hands.h3": "我会一门低级语言（C、汇编……）",

    "evo.kicker": "第 01 部分",
    "evo.head": "软件的<span class=\"serif\">演化。</span>",
    "evo.sub": "软件的每一层都建立在它下面的一层之上。这里把四层叠起来——从底部的机器，到顶端的自然语言。逐个展开。",
    "evo.l1.h": "二进制",
    "evo.l1.p": "每台计算机归根结底只懂两种状态：开和关——写作 0 和 1，比特再组成字节。凡是运行过的程序，某一刻都是二进制。",
    "evo.l2.h": "低级语言",
    "evo.l2.p": "汇编和 C 让你写得更贴近机器真正在做的事。内存要你自己管——没有安全网。快而精确，但每一个细节都是你的责任。",
    "evo.l3.h": "高级语言",
    "evo.l3.p": "读起来更像英语、而不像机器码的语言。内存由语言打理，你专注于逻辑。一种取舍：让出一些运行速度和控制权，换来写得快很多。",
    "evo.l4.h": "Vibe-coding（凭感觉编程）",
    "evo.l4.tag": "自然语言",
    "evo.l4.p": "用自然语言描述你想要什么，AI 来写代码——语法、结构、甚至用哪门语言，都由它决定。又一层抽象：同一条演化线，再往前一步。",
    "evo.closing": "每一层都把它下面的一层藏起来。Vibe-coding 不取代其他层——它坐在它们之上，就像 Python 坐在 C 之上，C 坐在二进制之上。",
    "evo.quote": "“也许十年后，跟 AI 说话也会显得同样过时。也许我们只需要想一下，产品就出现了。”",
    "evo.quote.cite": "——关于这条演化线可能通向哪里",

    "agent.kicker": "第 02 部分",
    "agent.head": "构建一个<span class=\"serif\">智能体。</span>",
    "agent.sub": "一个能推理、决策、行动的程序——不只是回答。它能调用工具：搜网页、跑代码、发交易。",
    "loop.observe": "观察",
    "loop.think": "思考",
    "loop.act": "行动",
    "loop.caption": "……然后再次观察",
    "agent.stack.head": "选择你的技术栈",
    "agent.local.tag": "开源 · 本地",
    "agent.local.h": "在你自己的机器上跑",
    "agent.local.p": "通过 Ollama 运行 Qwen 2.5（7B）或 Hermes 3（8B），4 位量化（Q4_K_M GGUF），压进约 4.3–4.7 GB。支持 Windows、Linux 和 macOS，内存下限 8 GB。在 Apple Silicon（M4）上，Metal 加速可达每秒 40–50+ tokens。",
    "agent.cloud.tag": "托管 · 经 OpenRouter",
    "agent.cloud.h": "调用云端的模型",
    "agent.cloud.p": "不需要本地算力。OpenRouter 提供对数十个模型的 API 访问，包含免费额度——当你的机器不够强时，是个不错的退路。",
    "agent.watch.head": "看着智能体思考",
    "agent.watch.sub": "每一步都看得见：智能体做了什么决定、调用了哪个工具、返回了什么。",
    "agent.trace.user": "我的 Sui 余额是多少？",
    "agent.trace.agent1": "调用",
    "agent.trace.agent2": "你有 12.4 SUI。",

    "sui.kicker": "第 03 部分",
    "sui.head": "Sui 上的<span class=\"serif\">智能体钱包。</span>",
    "sui.sub": "智能体用自然语言推理，但它做出的每一个动作，都是 Sui 上一笔真实的、已签名的交易。",
    "sui.p1": "自然语言请求",
    "sui.p2": "智能体推理",
    "sui.p3": "提出一笔交易",
    "sui.p4": "你审查",
    "sui.p5": "你签名",
    "sui.p6": "上链",
    "sui.build.head": "我们要做的东西",
    "sui.wallet.ask": "问问你的智能体……",
    "sui.wallet.prop": "向 alice.sui 转 2 SUI",
    "sui.wallet.confirm": "在链上确认",
    "sui.build.caption": "智能体用自然语言提出交易；签名的人始终是你。",

    "sources.kicker": "资料来源",
    "sources.head": "引用到的一切，<span class=\"serif\">都在这里。</span>",
    "src.sui.d": "钱包签名的目标 Layer-1",
    "src.basecamp.d": "本次工作坊所在的活动",
    "src.docs.d": "Move、交易、TypeScript SDK",
    "src.ollama.d": "在本地运行量化模型",
    "src.qwen.d": "本地使用的开放权重模型",
    "src.hermes.d": "另一个可选的本地模型",
    "src.gguf.d": "把模型压小的量化格式（Q4_K_M）",
    "src.openrouter.d": "一个 API 统一接入多个托管模型",
    "src.react.d": "观察→思考→行动循环的论文",
    "src.three.d": "本页的主视觉动画",
    "src.qr.d": "在你的浏览器里生成下面的二维码",

    "qr.head": "把它带走。",
    "qr.body": "这个二维码指向本页。扫一扫即可在手机上打开本工作坊——它是在你的浏览器里、根据本页加载的地址生成的。",

    "foot.blurb": "Agentic Workshop——BIAR 在 Sui Basecamp 2026 的一场分享。新加坡滨海湾金沙 · 10 月 7–8 日。",
    "foot.slides": "幻灯片（PDF）",
    "foot.top": "回到顶部",
    "foot.thanks": "谢谢——有问题吗？动手做吧。"
  },

  ms: {
    "nav.evolution": "Evolusi",
    "nav.agent": "Ejen",
    "nav.sui": "Sui",
    "nav.sources": "Sumber",
    "nav.slides": "Slaid",

    "deck.hint": "Kekunci anak panah, atau leret →",
    "contents.kicker": "Kandungan",
    "contents.01": "Evolusi perisian",
    "contents.02": "Membina sebuah ejen",
    "contents.03": "Dompet berejen di Sui",
    "evo.fourhead": "Empat lapisan, satu evolusi.",
    "agent.whathead": "Apa itu ejen?",
    "agent.run.head": "Menjalankannya",
    "sui.flowhead": "Daripada permintaan kepada tindakan atas rantai",

    "hero.eyebrow": "Sui Basecamp 2026 · Marina Bay Sands, Singapura · 7–8 Okt",
    "hero.title": "Agentic Workshop",
    "hero.tagline": "Daripada binari kepada ejen — cara perisian dibina, dan ke mana AI membawanya seterusnya.",
    "hero.lede": "Empat lapisan abstraksi, setiap satu dibina atas lapisan di bawahnya, berakhir di suatu tempat yang baharu: sebuah program yang anda ajak berbual, yang menaakul, membuat keputusan, dan menandatangani transaksinya sendiri. Halaman ini menyusuri keseluruhan laluan itu.",
    "hero.cta1": "Mula lawatan",
    "hero.cta2": "Muat turun slaid",
    "hero.cta3": "Sumber",

    "hands.kicker": "Sebelum kita mula",
    "hands.head": "Angkat tangan sebentar.",
    "hands.sub": "Tiada jawapan salah — ini cuma menentukan dari mana lawatan bermula untuk anda. Ketik yang berkenaan.",
    "hands.h1": "Saya vibe-code hari ini",
    "hands.h2": "Saya tahu bahasa peringkat tinggi (Python, JS…)",
    "hands.h3": "Saya tahu bahasa peringkat rendah (C, Assembly…)",

    "evo.kicker": "Bahagian 01",
    "evo.head": "Evolusi <span class=\"serif\">perisian.</span>",
    "evo.sub": "Setiap lapisan perisian dibina atas lapisan di bawahnya. Ini empat daripadanya, bertindan — daripada mesin di bawah hingga bahasa biasa di atas. Buka satu per satu.",
    "evo.l1.h": "Binari",
    "evo.l1.p": "Setiap komputer, pada dasarnya, hanya memahami dua keadaan: hidup dan mati — ditulis sebagai 0 dan 1, bit dikumpulkan menjadi bait. Setiap program yang pernah berjalan adalah binari pada satu ketika.",
    "evo.l2.h": "Bahasa peringkat rendah",
    "evo.l2.p": "Assembly dan C membolehkan anda menulis lebih hampir dengan apa yang mesin benar-benar lakukan. Anda menguruskan memori sendiri — tiada jaring keselamatan. Pantas dan tepat, tetapi setiap butiran adalah tanggungjawab anda.",
    "evo.l3.h": "Bahasa peringkat tinggi",
    "evo.l3.p": "Bahasa yang dibaca lebih hampir dengan bahasa Inggeris berbanding kod mesin. Bahasa itu menguruskan memori, jadi anda fokus pada logik. Satu tukar ganti: sedikit kelajuan dan kawalan, untuk kelajuan menulisnya yang jauh lebih tinggi.",
    "evo.l4.h": "Vibe-coding",
    "evo.l4.tag": "bahasa biasa",
    "evo.l4.p": "Gambarkan apa yang anda mahu dalam bahasa biasa; AI menulis kodnya — dan menentukan sintaks, struktur, malah bahasanya. Satu lagi lapisan abstraksi: evolusi yang sama, satu langkah lagi ke hadapan.",
    "evo.closing": "Setiap lapisan menyembunyikan lapisan di bawahnya. Vibe-coding tidak menggantikan yang lain — ia duduk di atasnya, sepertimana Python duduk di atas C, dan C duduk di atas binari.",
    "evo.quote": "“Mungkin dalam sepuluh tahun, bercakap dengan AI pun akan terasa lapuk. Mungkin kita hanya berfikir, dan sebuah produk muncul.”",
    "evo.quote.cite": "— tentang ke mana evolusi ini mungkin menuju",

    "agent.kicker": "Bahagian 02",
    "agent.head": "Membina sebuah <span class=\"serif\">ejen.</span>",
    "agent.sub": "Sebuah program yang boleh menaakul, membuat keputusan, dan bertindak — bukan sekadar menjawab. Ia boleh memanggil alat: cari web, jalankan kod, hantar transaksi.",
    "loop.observe": "perhati",
    "loop.think": "fikir",
    "loop.act": "bertindak",
    "loop.caption": "…kemudian perhati semula",
    "agent.stack.head": "Memilih timbunan anda",
    "agent.local.tag": "Sumber terbuka · setempat",
    "agent.local.h": "Jalankan pada mesin anda",
    "agent.local.p": "Qwen 2.5 (7B) atau Hermes 3 (8B) melalui Ollama, dikuantisasi 4-bit (Q4_K_M GGUF) supaya muat dalam ~4.3–4.7 GB. Windows, Linux dan macOS, dengan lantai RAM 8 GB. Pada Apple Silicon (M4), pecutan Metal memberi 40–50+ token/saat.",
    "agent.cloud.tag": "Dihos · melalui OpenRouter",
    "agent.cloud.h": "Panggil model di awan",
    "agent.cloud.p": "Tiada pengiraan setempat diperlukan. OpenRouter memberi akses API kepada berpuluh model, termasuk peringkat percuma — sandaran yang baik apabila mesin anda tidak cukup berkuasa.",
    "agent.watch.head": "Memerhati ejen berfikir",
    "agent.watch.sub": "Setiap langkah kelihatan: apa yang ejen putuskan, alat mana yang dipanggilnya, dan apa yang kembali.",
    "agent.trace.user": "berapa baki Sui saya?",
    "agent.trace.agent1": "memanggil",
    "agent.trace.agent2": "Anda ada 12.4 SUI.",

    "sui.kicker": "Bahagian 03",
    "sui.head": "Dompet berejen di <span class=\"serif\">Sui.</span>",
    "sui.sub": "Ejen menaakul dalam bahasa semula jadi, tetapi setiap tindakan yang diambilnya ialah transaksi sebenar yang ditandatangani di Sui.",
    "sui.p1": "permintaan bahasa biasa",
    "sui.p2": "ejen menaakul",
    "sui.p3": "cadang satu transaksi",
    "sui.p4": "anda semak",
    "sui.p5": "anda tandatangan",
    "sui.p6": "atas rantai",
    "sui.build.head": "Apa yang kita bina",
    "sui.wallet.ask": "Tanya ejen anda…",
    "sui.wallet.prop": "Hantar 2 SUI ke alice.sui",
    "sui.wallet.confirm": "SAHKAN ATAS RANTAI",
    "sui.build.caption": "Ejen mencadangkan transaksi dalam bahasa biasa; anda tetap orang yang menandatangani.",

    "sources.kicker": "Sumber",
    "sources.head": "Segala yang dirujuk, <span class=\"serif\">di satu tempat.</span>",
    "src.sui.d": "Layer-1 yang dompet menandatangani kepadanya",
    "src.basecamp.d": "Acara di mana bengkel ini disampaikan",
    "src.docs.d": "Move, transaksi, SDK TypeScript",
    "src.ollama.d": "Menjalankan model terkuantisasi secara setempat",
    "src.qwen.d": "Model pemberat terbuka yang digunakan setempat",
    "src.hermes.d": "Model setempat alternatif",
    "src.gguf.d": "Format kuantisasi (Q4_K_M) yang mengecilkan model",
    "src.openrouter.d": "Satu API di hadapan banyak model terhos",
    "src.react.d": "Gelung perhati → fikir → bertindak, ditulis",
    "src.three.d": "Animasi hero pada halaman ini",
    "src.qr.d": "Menjana kod di bawah, dalam pelayar anda",

    "qr.head": "Bawa ia bersama anda.",
    "qr.body": "Kod ini menghala ke halaman ini. Imbas untuk membuka bengkel pada telefon anda — ia dijana dalam pelayar anda, dari mana-mana halaman ini dimuatkan.",

    "foot.blurb": "Agentic Workshop — sesi oleh BIAR di Sui Basecamp 2026. Marina Bay Sands, Singapura · 7–8 Okt.",
    "foot.slides": "Slaid (PDF)",
    "foot.top": "Kembali ke atas",
    "foot.thanks": "Terima kasih — soalan? Mari bina."
  }
};

/* --- switcher --- */
(function () {
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var original = {};
  nodes.forEach(function (el) { original[el.dataset.i18n] = el.innerHTML; });

  var SUPPORTED = { en: 1, zh: 1, ms: 1 };

  window.applyLang = function (lang) {
    if (!SUPPORTED[lang]) lang = "en";
    var pack = lang === "en" ? null : window.I18N[lang];
    nodes.forEach(function (el) {
      var key = el.dataset.i18n;
      var val = pack && Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : original[key];
      if (el.innerHTML !== val) el.innerHTML = val;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem("sbc-lang", lang); } catch (e) {}
  };

  window.initialLang = function () {
    var saved;
    try { saved = localStorage.getItem("sbc-lang"); } catch (e) {}
    if (saved && SUPPORTED[saved]) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("zh") === 0) return "zh";
    if (nav.indexOf("ms") === 0 || nav.indexOf("id") === 0) return "ms";
    return "en";
  };
})();
