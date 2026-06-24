const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const header = document.getElementById('main-header');
const logo = document.getElementById('txt-title');
const playersUl = document.getElementById('players-ul');
const mainContent = document.getElementById('main-content');
const categorySelector = document.getElementById('category-selector');
const statsResults = document.getElementById('stats-results');
const playerSearch = document.getElementById('player-search');
const themeSwitch = document.getElementById('theme-switch');
const langSelect = document.getElementById('lang-select');

let allPlayersData = {};
let activeUUID = null;

// --- TRADUCTIONS ---
const i18n = {
    fr: { title: "🔍 MineStats", tagline: "L'analyseur de statistiques Minecraft ultra-fluide", dropMain: "🚀 Glissez vos fichiers .json ici", dropSub: "(dossier world/stats)", members: "Membres", search: "Rechercher...", colItem: "ÉLÉMENT", colVal: "VALEUR", placeholder: "Sélectionnez une catégorie ci-dessus.", selectPlayer: "Sélectionnez un joueur" },
    en: { title: "🔍 MineStats", tagline: "The ultra-smooth Minecraft statistics analyzer", dropMain: "🚀 Drop your .json files here", dropSub: "(world/stats folder)", members: "Members", search: "Search...", colItem: "ITEM", colVal: "VALUE", placeholder: "Select a category above.", selectPlayer: "Select a player" },
    es: { title: "🔍 MineStats", tagline: "El analizador de estadísticas de Minecraft ultra fluido", dropMain: "🚀 Suelta tus archivos .json aquí", dropSub: "(carpeta world/stats)", members: "Miembros", search: "Buscar...", colItem: "ELEMENTO", colVal: "VALOR", placeholder: "Seleccione una categoría arriba.", selectPlayer: "Selecciona un jugador" },
    de: { title: "🔍 MineStats", tagline: "Der ultra-glatte Minecraft-Statistik-Analysator", dropMain: "🚀 Ziehen Sie Ihre .json-Dateien hierher", dropSub: "(world/stats Ordner)", members: "Mitglieder", search: "Suche...", colItem: "OBJEKT", colVal: "WERT", placeholder: "Wähle oben eine Kategorie aus.", selectPlayer: "Wähle einen Spieler aus" },
    it: { title: "🔍 MineStats", tagline: "L'analizzatore di statistiche Minecraft ultra-fluido", dropMain: "🚀 Trascina qui i tuoi file .json", dropSub: "(cartella world/stats)", members: "Membri", search: "Cerca...", colItem: "ELEMENTO", colVal: "VALORE", placeholder: "Seleziona una categoria sopra.", selectPlayer: "Seleziona un giocatore" },
    pt: { title: "🔍 MineStats", tagline: "O analisador de estatísticas de Minecraft ultra-suave", dropMain: "🚀 Arraste seus arquivos .json aqui", dropSub: "(pasta world/stats)", members: "Membros", search: "Buscar...", colItem: "ITEM", colVal: "VALOR", placeholder: "Selecione uma categoria acima.", selectPlayer: "Selecione um jogador" },
    ru: { title: "🔍 MineStats", tagline: "Ультра-плавный анализатор статистики Minecraft", dropMain: "🚀 Перетащите файлы .json сюда", dropSub: "(папка world/stats)", members: "Игроки", search: "Поиск...", colItem: "ПРЕДМЕТ", colVal: "ЗНАЧЕНИЕ", placeholder: "Выберите категорию выше.", selectPlayer: "Выберите игрока" },
    zh: { title: "🔍 MineStats", tagline: "超顺滑的 Minecraft 统计分析器", dropMain: "🚀 将 .json 文件拖放到此处", dropSub: "(world/stats 文件夹)", members: "成员", search: "搜索...", colItem: "项目", colVal: "数值", placeholder: "请选择上方的一个类别。", selectPlayer: "选择一名玩家" },
    jp: { title: "🔍 MineStats", tagline: "超スムーズなMinecraft統計アナライザー", dropMain: "🚀 ここに.jsonファイルをドロップ", dropSub: "(world/stats フォルダ)", members: "メンバー", search: "検索...", colItem: "項目", colVal: "数値", placeholder: "上のカテゴリーを選択してください。", selectPlayer: "プレイヤーを選択" },
    kr: { title: "🔍 MineStats", tagline: "초간편 마인크래프트 통계 분석기", dropMain: "🚀 .json 파일을 여기에 드래그하세요", dropSub: "(world/stats 폴더)", members: "멤버", search: "검색...", colItem: "항목", colVal: "수치", placeholder: "위에서 카테고리를 선택하세요.", selectPlayer: "플레이어 선택" }
};

// --- LOGIQUE D'ACCUEIL ---
function goHome() {
    allPlayersData = {};
    activeUUID = null;
    header.classList.remove('minimized');
    mainContent.style.display = 'none';
    playersUl.innerHTML = "";
    playerSearch.value = "";
    fileInput.value = "";
    updateLanguage(langSelect.value);
}

logo.onclick = goHome;

function updateLanguage(lang) {
    const t = i18n[lang];
    document.getElementById('txt-title').innerText = t.title;
    document.getElementById('txt-tagline').innerText = t.tagline;
    document.getElementById('txt-drop-main').innerHTML = t.dropMain;
    document.getElementById('txt-drop-sub').innerText = t.dropSub;
    document.getElementById('txt-members').innerText = t.members;
    document.getElementById('player-search').placeholder = t.search;
    document.getElementById('txt-col-item').innerText = t.colItem;
    document.getElementById('txt-col-val').innerText = t.colVal;
    if (!activeUUID) {
        document.getElementById('txt-placeholder').innerText = t.placeholder;
        document.getElementById('current-player-name').innerText = t.selectPlayer;
    }
}

langSelect.onchange = (e) => {
    updateLanguage(e.target.value);
    localStorage.setItem('lang', e.target.value);
};

const savedLang = localStorage.getItem('lang') || 'fr';
langSelect.value = savedLang;
updateLanguage(savedLang);

// Thème
const setTheme = (isDark) => {
    if (isDark) document.body.classList.remove('light-mode');
    else document.body.classList.add('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
themeSwitch.onclick = () => setTheme(document.body.classList.contains('light-mode'));

// Logique fichiers
dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => handleFiles(e.target.files);
playerSearch.oninput = () => renderPlayerList(playerSearch.value.toLowerCase());

async function handleFiles(files) {
    if (files.length === 0) return;
    allPlayersData = {}; // On vide si on charge de nouveaux fichiers
    header.classList.add('minimized');
    mainContent.style.display = 'flex';
    playersUl.innerHTML = "<li>...</li>";

    for (let file of files) {
        if (!file.name.endsWith('.json')) continue;
        const uuid = file.name.replace('.json', '');
        const content = await file.text();
        const json = JSON.parse(content);
        allPlayersData[uuid] = { name: "...", stats: json.stats };

        fetch(`https://playerdb.co/api/player/minecraft/${uuid}`)
            .then(res => res.json())
            .then(data => {
                allPlayersData[uuid].name = data.success ? data.data.player.username : "Inconnu";
                renderPlayerList();
            }).catch(() => {
                allPlayersData[uuid].name = uuid.substring(0, 8);
                renderPlayerList();
            });
    }
}

function renderPlayerList(filter = "") {
    playersUl.innerHTML = "";
    const sorted = Object.keys(allPlayersData).sort((a,b) => 
        allPlayersData[a].name.localeCompare(allPlayersData[b].name)
    );
    sorted.forEach(uuid => {
        const name = allPlayersData[uuid].name;
        if (filter && !name.toLowerCase().includes(filter)) return;
        const li = document.createElement('li');
        if (uuid === activeUUID) li.className = "active";
        li.innerText = name;
        li.onclick = () => showPlayer(uuid);
        playersUl.appendChild(li);
    });
}

function showPlayer(uuid) {
    activeUUID = uuid;
    renderPlayerList(playerSearch.value.toLowerCase());
    const p = allPlayersData[uuid];
    document.getElementById('current-player-name').innerText = p.name;
    document.getElementById('current-player-uuid').innerText = uuid;
    categorySelector.innerHTML = "";
    statsResults.innerHTML = `<p class="placeholder-text">${i18n[langSelect.value].placeholder}</p>`;

    if(p.stats) {
        Object.keys(p.stats).forEach(cat => {
            const btn = document.createElement('button');
            btn.className = "cat-btn";
            btn.innerText = cat.split(':')[1] || cat;
            btn.onclick = () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showCategoryStats(cat);
            };
            categorySelector.appendChild(btn);
        });
    }
}

function showCategoryStats(category) {
    const data = allPlayersData[activeUUID].stats[category];
    statsResults.innerHTML = "";
    const sorted = Object.entries(data).sort((a,b) => b[1] - a[1]);
    sorted.forEach(([key, val]) => {
        const row = document.createElement('div');
        row.className = "stat-row";
        const clean = key.replace('minecraft:', '').replace(/_/g, ' ');
        row.innerHTML = `<span style="text-transform: capitalize;">${clean}</span>
                         <span class="stat-value">${val.toLocaleString()}</span>`;
        statsResults.appendChild(row);
    });
}