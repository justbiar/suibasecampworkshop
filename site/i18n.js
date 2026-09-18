/* Language packs. English lives in index.html; these override [data-i18n] nodes.
   Missing keys fall back to the original English. Values keep whatever inline
   markup the English node had (<span class="serif">). */

window.I18N = {
  zh: {
    "workshop.setup.shell": "每次打开新终端，先运行 nvm use 22，再执行 npm 命令。Windows 请在 WSL 中运行 Bash 安装。若不使用 nvm，请从官网下载当前 Node 22.x，重新打开终端，确认 node -v 后运行 setup.sh。",
    "workshop.setup.repair": "已经克隆，或遇到 EBADENGINE？在已有的 suibasecamp 文件夹内，用同一终端运行以下命令。无需再次克隆，也不要绕过版本检查。",
    "workshop.setup.nvm": "出现 nvm: command not found？通过下方官方指南安装 nvm，重新打开终端，再运行 command -v nvm。确认输出 nvm 后继续。",
    "workshop.setup.help": "首次安装或遇到安装错误？",
    "workshop.setup.verify": "安装前检查 node -v：应显示 v22.22.2 或更新的 22.x。setup.sh 会检查版本，使用 npm ci 安装锁定依赖并构建智能体。",
    "poll.manual": "手动总人数 · 保存在此浏览器中",
    "poll.auto": "使用二维码人数",
    "attendance.loading": "正在连接参与人数…",
    "attendance.live": "实时 · 二维码参与人数自动更新",
    "attendance.joined": "已计入。欢迎参加工作坊！",
    "attendance.error": "暂时无法获取人数。正在重新连接…",
    "attendance.retry": "重试",
    "poll.total": "参与者总数",
    "poll.reset": "重置人数",
    "poll.caption": "参与者百分比",
    "poll.high": "高级语言",
    "poll.low": "低级语言",
    "poll.empty": "扫描二维码或输入总人数以计算百分比。",
    "poll.note": "二维码访问自动更新总人数。编辑可使用手动总人数，点击“使用二维码人数”可恢复自动计数。分组可以重叠，百分比之和可能超过 100%。",
    "poll.error": "请输入 0 到 9999 之间的整数。组人数不能超过总人数。",
    "workshop.tutorial": "教程",
    "workshop.part3": "Sui 上的身份与记忆",
    "workshop.agent": "一个本地 TypeScript 程序，提供 Sui 钱包、身份和记忆工具。需要时由 OpenRouter 选择工具；应用验证调用并展示经验证的结果。",
    "workshop.stack.label": "02 / 技术栈",
    "workshop.stack.head": "一个智能体，四个组成部分。",
    "workshop.router": "通过托管模型选择工具。智能体在本地运行，无需下载模型或配备 GPU。",
    "workshop.chain": "通过 Sui SDK 创建本地 Ed25519 钱包并读取测试网余额。密钥保留在本地应用中。",
    "workshop.identity": "将名称解析为地址，并读取钱包在链上的默认名称。",
    "workshop.memory": "配置账户和委托密钥后，通过 MemWal 保存事实并在重启后检索。",
    "workshop.setup.label": "02 / 安装",
    "workshop.setup.head": "从教程开始。",
    "workshop.setup.intro": "macOS / Linux / WSL · 先安装 Git 和 nvm。需要 Node 22.22.2 或更新版本；Node 20 会出现 EBADENGINE。",
    "workshop.setup.env": "在本地编辑生成的 .env：添加你的 OPENROUTER_API_KEY。其余保持生成时的默认值即可——SUI_NETWORK=testnet 和 OPENROUTER_MODEL=openrouter/free 无需改动。",
    "workshop.setup.note": "无需 API 密钥也可使用本地斜杠命令。模型可用性取决于提供商。",
    "workshop.trace.head": "读结果，也要看来源。",
    "workshop.trace.sub": "先创建钱包，再查询余额。CLI 展示经过验证的工具数据，而不是模型编写的余额。",
    "workshop.trace.note": "通过官方测试网水龙头获取测试代币。当前智能体支持创建钱包和读取数据；转账和兑换属于未来计划。",
    "workshop.identity.head": "一个身份，一份<span class=\"serif\">记忆。</span>",
    "workshop.identity.intro": "为智能体设置 SuiNS 名称，再教它一个重启后仍能回忆的事实。Sui 提供链上状态，Walrus Memory 提供持久存储。",
    "workshop.suins.label": "03 / SUINS 身份",
    "workshop.suins.head": "与钱包关联的名称。",
    "workshop.suins.intro": "在 SuiNS 测试网注册名称，将其指向生成的钱包地址，并设置该地址的默认名称。",
    "workshop.suins.note": "AGENT_SUINS_NAME 仅设置预期名称，不会注册或修改链上身份。未设置名称时返回 NOT_FOUND。",
    "workshop.walrus.label": "03 / WALRUS 记忆",
    "workshop.walrus.head": "教它。重启。再问一次。",
    "workshop.walrus.intro": "在 .env 中配置 MEMWAL_ACCOUNT_ID 和 MEMWAL_PRIVATE_KEY（授权的委托密钥）。保持 MEMWAL_NAMESPACE 不变，并运行 npm run doctor。",
    "workshop.walrus.note": "等待持久化确认后再重启。中继服务接收明文，完成向量嵌入和 Seal 加密后存入 Walrus。存储期限取决于已付费的 epoch。",
    "workshop.directory.label": "03 / 分享智能体",
    "workshop.directory.head": "让你的智能体加入这里。",
    "workshop.directory.intro": "钱包读取、身份和记忆均正常后，在工作坊共享测试网包中注册资料。注册是单独的 Sui CLI 交易。",
    "workshop.directory.note": "按照注册指南，确保签名者与声明的钱包一致。索引完成后资料会出现；列入目录不代表服务正在运行。",
    "workshop.register": "注册智能体 →",
    "workshop.directory": "浏览目录 →",
    "workshop.source.sui": "钱包状态与链上身份",

    "deck.hint": "方向键，或滑动 →",
    "contents.kicker": "目录",
    "contents.01": "软件的演化",
    "contents.02": "构建一个智能体",
    "evo.fourhead": "四层，一条演化线。",
    "agent.whathead": "什么是智能体？",

    "hero.eyebrow": "Sui Basecamp 2026 · 新加坡滨海湾金沙 · 10 月 7–8 日",
    "hero.title": "Agentic Workshop",
    "hero.tagline": "从二进制到智能体——软件是怎样构建的，以及 AI 会把它带向何方。",

    "hands.kicker": "开始之前",
    "hands.head": "先举个手。",
    "hands.sub": "数一数举手的人数。输入每组的人数，图表会自动更新。",
    "hands.h1": "我现在会用 vibe-coding",
    "hands.h2": "我会一门高级语言（Python、JS……）",
    "hands.h3": "我会一门低级语言（C、汇编……）",

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

    "agent.head": "构建一个<span class=\"serif\">智能体。</span>",
    "loop.caption": "……然后再次观察",


    "sources.kicker": "资料来源",
    "src.basecamp.d": "本次工作坊所在的活动",
    "src.docs.d": "Move、交易、TypeScript SDK",
    "src.openrouter.d": "一个 API 统一接入多个托管模型",
    "src.react.d": "观察→思考→行动循环的论文",
    "src.three.d": "本页的主视觉动画",

    "qr.head": "把它带走。",

    "foot.blurb": "Agentic Workshop——BIAR 在 Sui Basecamp 2026 的一场分享。新加坡滨海湾金沙 · 10 月 7–8 日。",
    "foot.thanks": "谢谢——有问题吗？动手做吧。"
  },

  ms: {
    "workshop.setup.shell": "Dalam setiap terminal baharu, jalankan nvm use 22 sebelum arahan npm. Di Windows, gunakan WSL untuk setup Bash ini. Tanpa nvm, pasang Node 22.x terkini melalui muat turun rasmi, buka semula terminal dan semak node -v sebelum setup.sh.",
    "workshop.setup.repair": "Sudah klon atau mendapat EBADENGINE? Jalankan arahan berikut dalam folder suibasecamp sedia ada, di terminal yang sama. Jangan klon semula atau langkau semakan versi.",
    "workshop.setup.nvm": "nvm: command not found? Pasang nvm melalui panduan rasmi di bawah, buka semula terminal dan jalankan command -v nvm. Teruskan apabila output ialah nvm.",
    "workshop.setup.help": "Persediaan pertama atau ralat pemasangan?",
    "workshop.setup.verify": "Semak node -v sebelum pemasangan: mesti v22.22.2 atau 22.x yang lebih baharu. setup.sh menyemak versi, memasang dependensi terkunci dengan npm ci dan membina ejen.",
    "poll.manual": "Jumlah manual · disimpan dalam pelayar ini",
    "poll.auto": "Guna kiraan QR",
    "attendance.loading": "Menyambung kiraan peserta…",
    "attendance.live": "Langsung · Peserta QR dikemas kini automatik",
    "attendance.joined": "Anda telah dikira. Selamat datang!",
    "attendance.error": "Kiraan tidak tersedia. Menyambung semula…",
    "attendance.retry": "Cuba lagi",
    "poll.total": "Jumlah peserta",
    "poll.reset": "Tetapkan semula",
    "poll.caption": "Peratus peserta",
    "poll.high": "Bahasa peringkat tinggi",
    "poll.low": "Bahasa peringkat rendah",
    "poll.empty": "Imbas QR atau masukkan jumlah untuk mengira peratus.",
    "poll.note": "Jumlah dikemas kini melalui QR. Edit untuk jumlah manual, atau pilih “Guna kiraan QR” untuk kembali. Kumpulan boleh bertindih; jumlah peratus boleh melebihi 100%.",
    "poll.error": "Gunakan nombor bulat dari 0 hingga 9999. Bilangan kumpulan tidak boleh melebihi jumlah peserta.",
    "workshop.tutorial": "Tutorial",
    "workshop.part3": "Identiti &amp; memori di Sui",
    "workshop.agent": "Program TypeScript setempat dengan alat dompet Sui, identiti dan memori. OpenRouter memilih alat apabila diperlukan; aplikasi mengesahkan panggilan dan memaparkan hasil yang disahkan.",
    "workshop.stack.label": "02 / TEKNOLOGI BENGKEL",
    "workshop.stack.head": "Satu ejen. Empat komponen.",
    "workshop.router": "Akses model dihos untuk memilih alat. Ejen berjalan setempat; tiada muat turun model atau GPU diperlukan.",
    "workshop.chain": "Cipta dompet Ed25519 setempat dan baca baki testnet melalui Sui SDK. Kunci kekal dalam aplikasi setempat.",
    "workshop.identity": "Selesaikan nama kepada alamat dan baca nama lalai dompet pada rantai.",
    "workshop.memory": "Gunakan MemWal untuk menyimpan dan mengingat fakta selepas mula semula, dengan akaun dan delegat yang dikonfigurasi.",
    "workshop.setup.label": "02 / PERSEDIAAN",
    "workshop.setup.head": "Mulakan dengan tutorial.",
    "workshop.setup.intro": "macOS / Linux / WSL · Pasang Git dan nvm dahulu. Gunakan Node 22.22.2 atau lebih baharu; Node 20 menyebabkan EBADENGINE.",
    "workshop.setup.env": "Edit .env yang dijana secara setempat: tambah OPENROUTER_API_KEY anda. Biarkan yang lain seperti dijana — SUI_NETWORK=testnet dan OPENROUTER_MODEL=openrouter/free berfungsi sedia ada.",
    "workshop.setup.note": "Arahan slash setempat juga berfungsi tanpa kunci API. Ketersediaan model bergantung pada penyedia.",
    "workshop.trace.head": "Baca hasil. Kenali sumbernya.",
    "workshop.trace.sub": "Cipta dompet, kemudian baca bakinya. CLI memaparkan data alat yang disahkan dan bukannya baki yang ditulis oleh model.",
    "workshop.trace.note": "Gunakan faucet Testnet rasmi untuk token ujian. Ejen kini menyokong penciptaan dompet dan bacaan; pemindahan dan swap ialah rancangan masa depan.",
    "workshop.identity.head": "Satu identiti. Satu <span class=\"serif\">memori.</span>",
    "workshop.identity.intro": "Berikan ejen nama SuiNS, kemudian ajar fakta yang boleh diingat selepas mula semula. Sui membekalkan keadaan rantai; Walrus Memory menyediakan penyimpanan berterusan.",
    "workshop.suins.label": "03 / IDENTITI SUINS",
    "workshop.suins.head": "Nama yang dikaitkan dengan dompet.",
    "workshop.suins.intro": "Daftar nama di SuiNS Testnet, halakan ke alamat dompet yang dijana, dan tetapkan nama lalai alamat itu.",
    "workshop.suins.note": "AGENT_SUINS_NAME hanya menetapkan nama yang dijangka. Ia tidak mendaftar nama atau mengubah identiti pada rantai. Nama yang belum ditetapkan mengembalikan NOT_FOUND.",
    "workshop.walrus.label": "03 / MEMORI WALRUS",
    "workshop.walrus.head": "Ajar. Mula semula. Tanya lagi.",
    "workshop.walrus.intro": "Konfigurasi MEMWAL_ACCOUNT_ID dan MEMWAL_PRIVATE_KEY (kunci delegat yang dibenarkan) dalam .env. Kekalkan MEMWAL_NAMESPACE dan jalankan npm run doctor.",
    "workshop.walrus.note": "Tunggu pengesahan penyimpanan sebelum mula semula. Relayer menerima teks biasa dan mengurus embeddings serta penyulitan Seal sebelum penyimpanan Walrus. Tempohnya mengikut epoch yang dibiayai.",
    "workshop.directory.label": "03 / KONGSI EJEN",
    "workshop.directory.head": "Berikan ejen anda tempat di sini.",
    "workshop.directory.intro": "Selepas bacaan dompet, identiti dan memori berfungsi, daftar profil dalam pakej testnet bengkel. Pendaftaran ialah transaksi Sui CLI yang berasingan.",
    "workshop.directory.note": "Ikut panduan pendaftaran untuk menyamakan penandatangan dengan dompet yang diisytiharkan. Profil muncul selepas pengindeksan; penyenaraian bukan bukti perkhidmatan sedang berjalan.",
    "workshop.register": "Daftar ejen →",
    "workshop.directory": "Terokai direktori →",
    "workshop.source.sui": "Keadaan dompet dan identiti pada rantai",

    "deck.hint": "Kekunci anak panah, atau leret →",
    "contents.kicker": "Kandungan",
    "contents.01": "Evolusi perisian",
    "contents.02": "Membina sebuah ejen",
    "evo.fourhead": "Empat lapisan, satu evolusi.",
    "agent.whathead": "Apa itu ejen?",

    "hero.eyebrow": "Sui Basecamp 2026 · Marina Bay Sands, Singapura · 7–8 Okt",
    "hero.title": "Agentic Workshop",
    "hero.tagline": "Daripada binari kepada ejen — cara perisian dibina, dan ke mana AI membawanya seterusnya.",

    "hands.kicker": "Sebelum kita mula",
    "hands.head": "Angkat tangan sebentar.",
    "hands.sub": "Kira peserta yang mengangkat tangan. Masukkan bilangan bagi setiap kumpulan untuk mengemas kini carta.",
    "hands.h1": "Saya vibe-code hari ini",
    "hands.h2": "Saya tahu bahasa peringkat tinggi (Python, JS…)",
    "hands.h3": "Saya tahu bahasa peringkat rendah (C, Assembly…)",

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

    "agent.head": "Membina sebuah <span class=\"serif\">ejen.</span>",
    "loop.caption": "…kemudian perhati semula",


    "sources.kicker": "Sumber",
    "src.basecamp.d": "Acara di mana bengkel ini disampaikan",
    "src.docs.d": "Move, transaksi, SDK TypeScript",
    "src.openrouter.d": "Satu API di hadapan banyak model terhos",
    "src.react.d": "Gelung perhati → fikir → bertindak, ditulis",
    "src.three.d": "Animasi hero pada halaman ini",

    "qr.head": "Bawa ia bersama anda.",

    "foot.blurb": "Agentic Workshop — sesi oleh BIAR di Sui Basecamp 2026. Marina Bay Sands, Singapura · 7–8 Okt.",
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
