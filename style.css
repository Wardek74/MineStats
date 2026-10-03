// MineStats - Minecraft Analytics (Clean, Simple & Cross-Compatible)

// Éléments du DOM
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
const toastEl = document.getElementById('toast');

// Éléments de profil joueur
const currentPlayerName = document.getElementById('current-player-name');
const currentPlayerUuid = document.getElementById('current-player-uuid');
const currentPlayerAvatar = document.getElementById('current-player-avatar');
const playerTypeBadge = document.getElementById('player-type-badge');
const btnEditPlayer = document.getElementById('btn-edit-player');
const btnCopyUuid = document.getElementById('btn-copy-uuid');

// État de l'application
let allPlayersData = {};
let activeUUID = null;

// SVG par défaut de Steve pour utilisation 100% hors-ligne
const STEVE_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="64" height="64" shape-rendering="crispEdges">
  <rect width="8" height="8" fill="#c4936d"/>
  <rect x="0" y="0" width="8" height="2" fill="#4a3219"/>
  <rect x="0" y="2" width="1" height="1" fill="#4a3219"/>
  <rect x="7" y="2" width="1" height="1" fill="#4a3219"/>
  <rect x="1" y="3" width="2" height="1" fill="#ffffff"/>
  <rect x="2" y="3" width="1" height="1" fill="#2c42b5"/>
  <rect x="5" y="3" width="2" height="1" fill="#ffffff"/>
  <rect x="5" y="3" width="1" height="1" fill="#2c42b5"/>
  <rect x="3" y="4" width="2" height="1" fill="#935b3e"/>
  <rect x="2" y="5" width="4" height="1" fill="#693b22"/>
  <rect x="3" y="6" width="2" height="1" fill="#4a3219"/>
</svg>`);

// --- PERSISTANCE DU CACHE LOCAL DE NOMS (UUID -> NOM) ---
const CACHE_STORAGE_KEY = 'minestats_uuid_cache';
function getStoredNameCache() {
    try {
        const raw = localStorage.getItem(CACHE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function storePlayerName(uuid, name) {
    if (!uuid || !name) return;
    const cache = getStoredNameCache();
    const clean = normalizeUUID(uuid);
    cache[uuid.toLowerCase()] = name;
    cache[clean] = name;
    try {
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Impossible de sauvegarder dans localStorage', e);
    }
}

function storeMultipleNames(mapping) {
    const cache = getStoredNameCache();
    for (const [uuid, name] of Object.entries(mapping)) {
        if (!uuid || !name) continue;
        const clean = normalizeUUID(uuid);
        cache[uuid.toLowerCase()] = name;
        cache[clean] = name;
    }
    try {
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Impossible de sauvegarder dans localStorage', e);
    }
}

function getStoredName(uuid) {
    const cache = getStoredNameCache();
    const clean = normalizeUUID(uuid);
    return cache[uuid.toLowerCase()] || cache[clean] || null;
}

// --- UTILITAIRES UUID & CRYPTO (MD5 PUR JS POUR MINECRAFT OFFLINE) ---

// Normalise l'UUID sans tiret
function normalizeUUID(uuid) {
    return (uuid || '').replace(/[^a-fA-F0-9]/g, '').toLowerCase();
}

// Formate un UUID en format standard 8-4-4-4-12
function formatUUID(uuid) {
    const clean = normalizeUUID(uuid);
    if (clean.length === 32) {
        return `${clean.slice(0,8)}-${clean.slice(8,12)}-${clean.slice(12,16)}-${clean.slice(16,20)}-${clean.slice(20,32)}`;
    }
    return (uuid || '').toLowerCase();
}

// Détection du type de compte (Premium v4, Offline v3, Bedrock Floodgate v0)
function getPlayerAccountType(uuid) {
    const clean = normalizeUUID(uuid);
    if (clean.length !== 32) return 'unknown';
    if (clean.startsWith('0000000000000000') || clean[12] === '0') {
        return 'bedrock';
    }
    const version = clean[12];
    if (version === '4') return 'premium';
    if (version === '3') return 'offline';
    return 'unknown';
}

// Algorithme MD5 standard autonome en pur JS
function md5(string) {
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
        var lX4 = (lX & 0x40000000), lY4 = (lY & 0x40000000);
        var lX8 = (lX & 0x80000000), lY8 = (lY & 0x80000000);
        var lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    var utf8 = unescape(encodeURIComponent(string));
    var x = [];
    for (var i = 0; i < utf8.length; i++) {
        x[i >> 2] |= (utf8.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
    }
    var len = utf8.length * 8;
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a, oldb = b, oldc = c, oldd = d;
        a = FF(a, b, c, d, x[i+0], 7, -680876936);
        d = FF(d, a, b, c, x[i+1], 12, -389564586);
        c = FF(c, d, a, b, x[i+2], 17, 606105819);
        b = FF(b, c, d, a, x[i+3], 22, -1044525330);
        a = FF(a, b, c, d, x[i+4], 7, -176418897);
        d = FF(d, a, b, c, x[i+5], 12, 1200080426);
        c = FF(c, d, a, b, x[i+6], 17, -1473231341);
        b = FF(b, c, d, a, x[i+7], 22, -45705983);
        a = FF(a, b, c, d, x[i+8], 7, 1770035416);
        d = FF(d, a, b, c, x[i+9], 12, -1958414417);
        c = FF(c, d, a, b, x[i+10], 17, -42063);
        b = FF(b, c, d, a, x[i+11], 22, -1990404162);
        a = FF(a, b, c, d, x[i+12], 7, 1804603682);
        d = FF(d, a, b, c, x[i+13], 12, -40341101);
        c = FF(c, d, a, b, x[i+14], 17, -1502002290);
        b = FF(b, c, d, a, x[i+15], 22, 1236535329);

        a = GG(a, b, c, d, x[i+1], 5, -165796510);
        d = GG(d, a, b, c, x[i+6], 9, -1069501632);
        c = GG(c, d, a, b, x[i+11], 14, 643717713);
        b = GG(b, c, d, a, x[i+0], 20, -373897302);
        a = GG(a, b, c, d, x[i+5], 5, -701558691);
        d = GG(d, a, b, c, x[i+10], 9, 38016083);
        c = GG(c, d, a, b, x[i+15], 14, -660478335);
        b = GG(b, c, d, a, x[i+4], 20, -405537848);
        a = GG(a, b, c, d, x[i+9], 5, 568446438);
        d = GG(d, a, b, c, x[i+14], 9, -1019803690);
        c = GG(c, d, a, b, x[i+3], 14, -187363961);
        b = GG(b, c, d, a, x[i+8], 20, 1163531501);
        a = GG(a, b, c, d, x[i+13], 5, -1444681467);
        d = GG(d, a, b, c, x[i+2], 9, -51403784);
        c = GG(c, d, a, b, x[i+7], 14, 1735328473);
        b = GG(b, c, d, a, x[i+12], 20, -1926607734);

        a = HH(a, b, c, d, x[i+5], 4, -378558);
        d = HH(d, a, b, c, x[i+8], 11, -2022574463);
        c = HH(c, d, a, b, x[i+11], 16, 1839030562);
        b = HH(b, c, d, a, x[i+14], 23, -35309556);
        a = HH(a, b, c, d, x[i+1], 4, -1530992060);
        d = HH(d, a, b, c, x[i+4], 11, 1272893353);
        c = HH(c, d, a, b, x[i+7], 16, -155497632);
        b = HH(b, c, d, a, x[i+10], 23, -1094730640);
        a = HH(a, b, c, d, x[i+13], 4, 681279174);
        d = HH(d, a, b, c, x[i+0], 11, -358537222);
        c = HH(c, d, a, b, x[i+3], 16, -722521979);
        b = HH(b, c, d, a, x[i+6], 23, 76029189);
        a = HH(a, b, c, d, x[i+9], 4, -640364487);
        d = HH(d, a, b, c, x[i+12], 11, -421815835);
        c = HH(c, d, a, b, x[i+15], 16, 530742520);
        b = HH(b, c, d, a, x[i+2], 23, -995338651);

        a = II(a, b, c, d, x[i+0], 6, -198630844);
        d = II(d, a, b, c, x[i+7], 10, 1126891415);
        c = II(c, d, a, b, x[i+14], 15, -1416354905);
        b = II(b, c, d, a, x[i+5], 21, -57434055);
        a = II(a, b, c, d, x[i+12], 6, 1700485571);
        d = II(d, a, b, c, x[i+3], 10, -1894986606);
        c = II(c, d, a, b, x[i+10], 15, -1051523);
        b = II(b, c, d, a, x[i+1], 21, -2054922799);
        a = II(a, b, c, d, x[i+8], 6, 1873313359);
        d = II(d, a, b, c, x[i+15], 10, -30611744);
        c = II(c, d, a, b, x[i+6], 15, -1560198380);
        b = II(b, c, d, a, x[i+13], 21, 1309151649);
        a = II(a, b, c, d, x[i+4], 6, -145523070);
        d = II(d, a, b, c, x[i+11], 10, -1120210379);
        c = II(c, d, a, b, x[i+2], 15, 718787259);
        b = II(b, c, d, a, x[i+9], 21, -343485551);

        a = addUnsigned(a, olda);
        b = addUnsigned(b, oldb);
        c = addUnsigned(c, oldc);
        d = addUnsigned(d, oldd);
    }

    var bytes = [];
    [a, b, c, d].forEach(function(val) {
        bytes.push(val & 0xFF);
        bytes.push((val >>> 8) & 0xFF);
        bytes.push((val >>> 16) & 0xFF);
        bytes.push((val >>> 24) & 0xFF);
    });
    return bytes;
}

// Calcule l'UUID version 3 officiel généré par Minecraft en mode Offline :
// UUID.nameUUIDFromBytes(("OfflinePlayer:" + username).getBytes(StandardCharsets.UTF_8))
function getMinecraftOfflineUUID(username) {
    if (!username) return null;
    const cleanUser = username.trim();
    const bytes = md5("OfflinePlayer:" + cleanUser);
    bytes[6] = (bytes[6] & 0x0f) | 0x30; // version 3
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // IETF variant
    const hex = bytes.map(b => (b < 16 ? "0" : "") + b.toString(16)).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

// --- TRADUCTIONS (10 LANGUES) ---
const i18n = {
    fr: {
        title: "🔍 MineStats",
        tagline: "L'analyseur de statistiques Minecraft ultra-fluide",
        dropMain: "🚀 Glissez vos fichiers <code>.json</code> ou dossier ici",
        dropSub: "(world/stats et/ou usercache.json)",
        btnFiles: "Fichiers stats",
        btnFolder: "Dossier complet",
        btnCache: "usercache.json",
        btnNames: "Pseudos offline",
        members: "Membres",
        search: "Rechercher par nom ou UUID...",
        colItem: "ÉLÉMENT",
        colVal: "VALEUR",
        placeholder: "Sélectionnez une catégorie ci-dessus.",
        selectPlayer: "Sélectionnez un joueur",
        offlineBadge: "Hors-ligne",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Modifier le pseudo",
        promptEditName: "Entrez le nouveau pseudo pour ce joueur :",
        modalTitle: "Associer des pseudos offline",
        modalDesc: "Collez la liste des pseudos de vos joueurs (un par ligne ou séparés par des virgules). Leurs UUIDs offline seront automatiquement calculés et associés aux stats :",
        modalPlaceholder: "Exemple :\nNotch\nSteve\nAlex",
        modalApply: "Calculer et Associer",
        modalCancel: "Annuler",
        uuidCopied: "UUID copié dans le presse-papiers !",
        offlineNotice: "💡 Des joueurs hors-ligne sans pseudo détectés",
        noticeAction: "Associer",
        cacheLoaded: "{count} joueur(s) chargé(s) depuis usercache !",
        matchSuccess: "{count} pseudo(s) offline associé(s) avec succès !",
        nameUpdated: "Pseudo mis à jour !",
        unknownOffline: "Hors-ligne",
        unknownBedrock: "Bedrock",
        unknownPremium: "Joueur"
    },
    en: {
        title: "🔍 MineStats",
        tagline: "The ultra-smooth Minecraft statistics analyzer",
        dropMain: "🚀 Drop your <code>.json</code> files or folder here",
        dropSub: "(world/stats and/or usercache.json)",
        btnFiles: "Stats files",
        btnFolder: "Full folder",
        btnCache: "usercache.json",
        btnNames: "Offline usernames",
        members: "Members",
        search: "Search by name or UUID...",
        colItem: "ITEM",
        colVal: "VALUE",
        placeholder: "Select a category above.",
        selectPlayer: "Select a player",
        offlineBadge: "Offline",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Edit username",
        promptEditName: "Enter new username for this player:",
        modalTitle: "Match offline usernames",
        modalDesc: "Paste your player usernames list (one per line or comma-separated). Their offline UUIDs will be automatically calculated and linked:",
        modalPlaceholder: "Example:\nNotch\nSteve\nAlex",
        modalApply: "Calculate & Match",
        modalCancel: "Cancel",
        uuidCopied: "UUID copied to clipboard!",
        offlineNotice: "💡 Offline players without username detected",
        noticeAction: "Match",
        cacheLoaded: "{count} player(s) loaded from usercache!",
        matchSuccess: "{count} offline username(s) matched!",
        nameUpdated: "Username updated!",
        unknownOffline: "Offline",
        unknownBedrock: "Bedrock",
        unknownPremium: "Player"
    },
    es: {
        title: "🔍 MineStats",
        tagline: "El analizador de estadísticas de Minecraft ultra fluido",
        dropMain: "🚀 Suelta tus archivos <code>.json</code> o carpeta aquí",
        dropSub: "(world/stats y/o usercache.json)",
        btnFiles: "Archivos de stats",
        btnFolder: "Carpeta completa",
        btnCache: "usercache.json",
        btnNames: "Nombres offline",
        members: "Miembros",
        search: "Buscar por nombre o UUID...",
        colItem: "ELEMENTO",
        colVal: "VALOR",
        placeholder: "Seleccione una categoría arriba.",
        selectPlayer: "Selecciona un jugador",
        offlineBadge: "Offline",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Editar nombre",
        promptEditName: "Introduce el nuevo nombre para este jugador:",
        modalTitle: "Asociar nombres offline",
        modalDesc: "Pega la lista de nombres de jugadores (uno por línea o separados por comas). Sus UUIDs offline se calcularán automáticamente:",
        modalPlaceholder: "Ejemplo:\nNotch\nSteve\nAlex",
        modalApply: "Calcular y Asociar",
        modalCancel: "Cancelar",
        uuidCopied: "¡UUID copiado al portapapeles!",
        offlineNotice: "💡 Jugadores offline sin nombre detectados",
        noticeAction: "Asociar",
        cacheLoaded: "¡{count} jugador(es) cargado(s) desde usercache!",
        matchSuccess: "¡{count} nombre(s) offline asociado(s) con éxito!",
        nameUpdated: "¡Nombre actualizado!",
        unknownOffline: "Offline",
        unknownBedrock: "Bedrock",
        unknownPremium: "Jugador"
    },
    de: {
        title: "🔍 MineStats",
        tagline: "Der ultra-glatte Minecraft-Statistik-Analysator",
        dropMain: "🚀 .json-Dateien oder Ordner hierher ziehen",
        dropSub: "(world/stats und/oder usercache.json)",
        btnFiles: "Stats-Dateien",
        btnFolder: "Ganzer Ordner",
        btnCache: "usercache.json",
        btnNames: "Offline-Namen",
        members: "Mitglieder",
        search: "Nach Name oder UUID suchen...",
        colItem: "OBJEKT",
        colVal: "WERT",
        placeholder: "Wähle oben eine Kategorie aus.",
        selectPlayer: "Wähle einen Spieler aus",
        offlineBadge: "Offline",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Benutzername bearbeiten",
        promptEditName: "Neuen Benutzernamen eingeben:",
        modalTitle: "Offline-Namen zuordnen",
        modalDesc: "Füge die Liste der Spielernamen ein (einer pro Zeile oder durch Kommas getrennt). Ihre Offline-UUIDs werden berechnet:",
        modalPlaceholder: "Beispiel:\nNotch\nSteve\nAlex",
        modalApply: "Berechnen & Zuordnen",
        modalCancel: "Abbrechen",
        uuidCopied: "UUID in Zwischenablage kopiert!",
        offlineNotice: "💡 Offline-Spieler ohne Namen erkannt",
        noticeAction: "Zuordnen",
        cacheLoaded: "{count} Spieler aus usercache geladen!",
        matchSuccess: "{count} Offline-Name(n) erfolgreich zugeordnet!",
        nameUpdated: "Name aktualisiert!",
        unknownOffline: "Offline",
        unknownBedrock: "Bedrock",
        unknownPremium: "Spieler"
    },
    it: {
        title: "🔍 MineStats",
        tagline: "L'analizzatore di statistiche Minecraft ultra-fluido",
        dropMain: "🚀 Trascina i file <code>.json</code> o la cartella qui",
        dropSub: "(world/stats e/o usercache.json)",
        btnFiles: "File stats",
        btnFolder: "Cartella intera",
        btnCache: "usercache.json",
        btnNames: "Nomi offline",
        members: "Membri",
        search: "Cerca per nome o UUID...",
        colItem: "ELEMENTO",
        colVal: "VALORE",
        placeholder: "Seleziona una categoria sopra.",
        selectPlayer: "Seleziona un giocatore",
        offlineBadge: "Offline",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Modifica nome",
        promptEditName: "Inserisci il nuovo nome per questo giocatore:",
        modalTitle: "Associa nomi offline",
        modalDesc: "Incolla l'elenco dei nomi dei tuoi giocatori (uno per riga o separati da virgole). Gli UUID offline verranno calcolati:",
        modalPlaceholder: "Esempio:\nNotch\nSteve\nAlex",
        modalApply: "Calcola e Associa",
        modalCancel: "Annulla",
        uuidCopied: "UUID copiato negli appunti!",
        offlineNotice: "💡 Rilevati giocatori offline senza nome",
        noticeAction: "Associa",
        cacheLoaded: "{count} giocatore/i caricato/i da usercache!",
        matchSuccess: "{count} nome/i offline associato/i!",
        nameUpdated: "Nome aggiornato!",
        unknownOffline: "Offline",
        unknownBedrock: "Bedrock",
        unknownPremium: "Giocatore"
    },
    pt: {
        title: "🔍 MineStats",
        tagline: "O analisador de estatísticas de Minecraft ultra-suave",
        dropMain: "🚀 Arraste seus arquivos <code>.json</code> ou pasta aqui",
        dropSub: "(world/stats e/ou usercache.json)",
        btnFiles: "Arquivos stats",
        btnFolder: "Pasta completa",
        btnCache: "usercache.json",
        btnNames: "Nomes offline",
        members: "Membros",
        search: "Buscar por nome ou UUID...",
        colItem: "ITEM",
        colVal: "VALOR",
        placeholder: "Selecione uma categoria acima.",
        selectPlayer: "Selecione um jogador",
        offlineBadge: "Offline",
        premiumBadge: "Premium",
        bedrockBadge: "Bedrock",
        editName: "Editar nome",
        promptEditName: "Digite o novo nome para este jogador:",
        modalTitle: "Associar nomes offline",
        modalDesc: "Cole a lista de nomes dos jogadores (um por linha ou separados por vírgulas). Seus UUIDs offline serão calculados:",
        modalPlaceholder: "Exemplo:\nNotch\nSteve\nAlex",
        modalApply: "Calcular e Associar",
        modalCancel: "Cancelar",
        uuidCopied: "UUID copiado para a área de transferência!",
        offlineNotice: "💡 Jogadores offline sem nome detectados",
        noticeAction: "Associar",
        cacheLoaded: "{count} jogador(es) carregado(s) do usercache!",
        matchSuccess: "{count} nome(s) offline associado(s) com sucesso!",
        nameUpdated: "Nome atualizado!",
        unknownOffline: "Offline",
        unknownBedrock: "Bedrock",
        unknownPremium: "Jogador"
    },
    ru: {
        title: "🔍 MineStats",
        tagline: "Ультра-плавный анализатор статистики Minecraft",
        dropMain: "🚀 Перетащите файлы <code>.json</code> или папку сюда",
        dropSub: "(world/stats и/или usercache.json)",
        btnFiles: "Файлы статистики",
        btnFolder: "Вся папка",
        btnCache: "usercache.json",
        btnNames: "Оффлайн ники",
        members: "Игроки",
        search: "Поиск по нику или UUID...",
        colItem: "ПРЕДМЕТ",
        colVal: "ЗНАЧЕНИЕ",
        placeholder: "Выберите категорию выше.",
        selectPlayer: "Выберите игрока",
        offlineBadge: "Оффлайн",
        premiumBadge: "Премиум",
        bedrockBadge: "Bedrock",
        editName: "Изменить ник",
        promptEditName: "Введите новый ник для этого игрока:",
        modalTitle: "Привязать оффлайн ники",
        modalDesc: "Вставьте список ников игроков (по одному на строку или через запятую). Их оффлайн UUID будут рассчитаны автоматически:",
        modalPlaceholder: "Пример:\nNotch\nSteve\nAlex",
        modalApply: "Рассчитать и привязать",
        modalCancel: "Отмена",
        uuidCopied: "UUID скопирован в буфер обмена!",
        offlineNotice: "💡 Обнаружены оффлайн игроки без ника",
        noticeAction: "Привязать",
        cacheLoaded: "{count} игрок(ов) загружено из usercache!",
        matchSuccess: "{count} оффлайн ник(ов) успешно привязано!",
        nameUpdated: "Ник обновлен!",
        unknownOffline: "Оффлайн",
        unknownBedrock: "Bedrock",
        unknownPremium: "Игрок"
    },
    zh: {
        title: "🔍 MineStats",
        tagline: "超顺滑的 Minecraft 统计分析器",
        dropMain: "🚀 将 <code>.json</code> 文件或文件夹拖放到此处",
        dropSub: "(world/stats 或 usercache.json)",
        btnFiles: "统计文件",
        btnFolder: "整个文件夹",
        btnCache: "usercache.json",
        btnNames: "离线玩家名",
        members: "成员",
        search: "按名称或 UUID 搜索...",
        colItem: "项目",
        colVal: "数值",
        placeholder: "请选择上方的一个类别。",
        selectPlayer: "选择一名玩家",
        offlineBadge: "离线",
        premiumBadge: "正版",
        bedrockBadge: "基岩版",
        editName: "修改名称",
        promptEditName: "输入该玩家的新名称：",
        modalTitle: "关联离线玩家名",
        modalDesc: "粘贴您的玩家名列表（每行一个或以逗号分隔）。将自动计算离线 UUID 并匹配：",
        modalPlaceholder: "示例：\nNotch\nSteve\nAlex",
        modalApply: "计算并关联",
        modalCancel: "取消",
        uuidCopied: "UUID 已复制到剪贴板！",
        offlineNotice: "💡 检测到未识别的离线玩家",
        noticeAction: "关联名称",
        cacheLoaded: "已从 usercache 加载 {count} 名玩家！",
        matchSuccess: "成功匹配 {count} 个离线名称！",
        nameUpdated: "名称已更新！",
        unknownOffline: "离线玩家",
        unknownBedrock: "基岩玩家",
        unknownPremium: "玩家"
    },
    jp: {
        title: "🔍 MineStats",
        tagline: "超スムーズなMinecraft統計アナライザー",
        dropMain: "🚀 <code>.json</code>ファイルまたはフォルダをドロップ",
        dropSub: "(world/stats または usercache.json)",
        btnFiles: "統計ファイル",
        btnFolder: "フォルダ全体",
        btnCache: "usercache.json",
        btnNames: "オフライン名",
        members: "メンバー",
        search: "名前またはUUIDで検索...",
        colItem: "項目",
        colVal: "数値",
        placeholder: "上のカテゴリーを選択してください。",
        selectPlayer: "プレイヤーを選択",
        offlineBadge: "オフライン",
        premiumBadge: "プレミアム",
        bedrockBadge: "統合版",
        editName: "ユーザー名を編集",
        promptEditName: "このプレイヤーの新しい名前を入力：",
        modalTitle: "オフライン名を紐付け",
        modalDesc: "プレイヤー名のリストを貼り付けてください（改行またはカンマ区切り）。オフラインUUIDが自動計算されます：",
        modalPlaceholder: "例：\nNotch\nSteve\nAlex",
        modalApply: "計算して紐付け",
        modalCancel: "キャンセル",
        uuidCopied: "UUIDをクリップボードにコピーしました！",
        offlineNotice: "💡 名前のないオフラインプレイヤーを検出",
        noticeAction: "紐付け",
        cacheLoaded: "usercacheから{count}人のプレイヤーを読み込みました！",
        matchSuccess: "{count}個のオフライン名を紐付けました！",
        nameUpdated: "名前を更新しました！",
        unknownOffline: "オフライン",
        unknownBedrock: "統合版",
        unknownPremium: "プレイヤー"
    },
    kr: {
        title: "🔍 MineStats",
        tagline: "초간편 마인크래프트 통계 분석기",
        dropMain: "🚀 <code>.json</code> 파일 또는 폴더를 드래그하세요",
        dropSub: "(world/stats 또는 usercache.json)",
        btnFiles: "통계 파일",
        btnFolder: "전체 폴더",
        btnCache: "usercache.json",
        btnNames: "오프라인 닉네임",
        members: "멤버",
        search: "이름 또는 UUID로 검색...",
        colItem: "항목",
        colVal: "수치",
        placeholder: "위에서 카테고리를 선택하세요.",
        selectPlayer: "플레이어 선택",
        offlineBadge: "오프라인",
        premiumBadge: "정품",
        bedrockBadge: "베드락",
        editName: "닉네임 수정",
        promptEditName: "이 플레이어의 새 닉네임을 입력하세요:",
        modalTitle: "오프라인 닉네임 연결",
        modalDesc: "플레이어 닉네임 목록을 붙여넣으세요(줄바꿈 또는 쉼표 구분). 오프라인 UUID가 자동으로 계산되어 연결됩니다:",
        modalPlaceholder: "예시:\nNotch\nSteve\nAlex",
        modalApply: "계산 및 연결",
        modalCancel: "취소",
        uuidCopied: "UUID가 클립보드에 복사되었습니다!",
        offlineNotice: "💡 이름이 없는 오프라인 플레이어가 감지되었습니다",
        noticeAction: "연결하기",
        cacheLoaded: "usercache에서 {count}명의 플레이어를 불러왔습니다!",
        matchSuccess: "{count}개의 오프라인 닉네임이 성공적으로 연결되었습니다!",
        nameUpdated: "닉네임이 업데이트되었습니다!",
        unknownOffline: "오프라인",
        unknownBedrock: "베드락",
        unknownPremium: "플레이어"
    }
};

// Affichage d'un message Toast
let toastTimer = null;
function showToast(message) {
    if (!toastEl) return;
    toastEl.innerText = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3200);
}

// Mise à jour de la langue
function updateLanguage(lang) {
    const t = i18n[lang] || i18n.fr;
    document.getElementById('txt-title').innerText = t.title;
    document.getElementById('txt-tagline').innerText = t.tagline;
    document.getElementById('txt-drop-main').innerHTML = t.dropMain;
    document.getElementById('txt-drop-sub').innerText = t.dropSub;
    document.getElementById('txt-members').innerText = t.members;
    playerSearch.placeholder = t.search;
    document.getElementById('txt-col-item').innerText = t.colItem;
    document.getElementById('txt-col-val').innerText = t.colVal;

    if (!activeUUID) {
        document.getElementById('txt-placeholder').innerText = t.placeholder;
        currentPlayerName.innerText = t.selectPlayer;
    } else {
        updatePlayerBannerUI(activeUUID);
    }
}

langSelect.onchange = (e) => {
    updateLanguage(e.target.value);
    localStorage.setItem('lang', e.target.value);
};

const savedLang = localStorage.getItem('lang') || 'fr';
langSelect.value = savedLang;
updateLanguage(savedLang);

// Thème Clair / Sombre
const setTheme = (isDark) => {
    if (isDark) document.body.classList.remove('light-mode');
    else document.body.classList.add('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
themeSwitch.onclick = () => setTheme(document.body.classList.contains('light-mode'));

// Navigation retour à l'accueil
function goHome() {
    allPlayersData = {};
    activeUUID = null;
    header.classList.remove('minimized');
    mainContent.style.display = 'none';
    playersUl.innerHTML = "";
    playerSearch.value = "";
    fileInput.value = "";
    btnEditPlayer.style.display = 'none';
    btnCopyUuid.style.display = 'none';
    playerTypeBadge.style.display = 'none';
    currentPlayerAvatar.src = "";
    updateLanguage(langSelect.value);
}
logo.onclick = goHome;

// --- GESTION DU DRAG & DROP & DES INPUTS DE FICHIERS ---

// Drag & drop feedback visuel
['dragenter', 'dragover'].forEach(eventName => {
    window.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    window.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
    }, false);
});

// Événement Drop récursif (gère fichiers et dossiers)
window.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    if (!e.dataTransfer) return;
    const files = await getFilesFromDataTransfer(e.dataTransfer);
    if (files.length > 0) {
        await processFiles(files);
    }
});

dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => processFiles(Array.from(e.target.files));

// Lecture récursive des fichiers & dossiers via webkitGetAsEntry
async function getFilesFromDataTransfer(dataTransfer) {
    const files = [];
    const items = dataTransfer.items;
    if (items && items.length > 0 && items[0].webkitGetAsEntry) {
        const queue = [];
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry();
            if (entry) queue.push(entry);
        }
        while (queue.length > 0) {
            const entry = queue.shift();
            if (entry.isFile) {
                const f = await new Promise(resolve => entry.file(resolve));
                files.push(f);
            } else if (entry.isDirectory) {
                const reader = entry.createReader();
                const entries = await readAllDirectoryEntries(reader);
                for (const sub of entries) {
                    queue.push(sub);
                }
            }
        }
    } else if (dataTransfer.files) {
        for (let i = 0; i < dataTransfer.files.length; i++) {
            files.push(dataTransfer.files[i]);
        }
    }
    return files;
}

async function readAllDirectoryEntries(reader) {
    let allEntries = [];
    let entries;
    do {
        entries = await new Promise(resolve => reader.readEntries(resolve, () => resolve([])));
        if (entries && entries.length > 0) {
            allEntries = allEntries.concat(entries);
        }
    } while (entries && entries.length > 0);
    return allEntries;
}

// --- TRAITEMENT DES FICHIERS ---
async function processFiles(files) {
    if (!files || files.length === 0) return;

    const t = i18n[langSelect.value] || i18n.fr;

    // 1. Filtrer les fichiers de cache (usercache.json, usernamecache.json, whitelist.json, ops.json)
    const cacheFiles = [];
    const statsFiles = [];

    for (const f of files) {
        const nameLower = f.name.toLowerCase();
        if (!nameLower.endsWith('.json')) continue;
        if (nameLower.includes('usercache') || nameLower.includes('usernamecache') ||
            nameLower.includes('whitelist') || nameLower.includes('ops') || nameLower.includes('banned')) {
            cacheFiles.push(f);
        } else {
            statsFiles.push(f);
        }
    }

    // 2. Traiter d'abord les fichiers de cache pour alimenter le répertoire de noms
    let loadedCacheCount = 0;
    for (const cf of cacheFiles) {
        try {
            const text = await cf.text();
            const json = JSON.parse(text);
            const count = extractNamesFromJson(json);
            loadedCacheCount += count;
        } catch (err) {
            console.error("Erreur de lecture du fichier cache:", cf.name, err);
        }
    }

    if (loadedCacheCount > 0) {
        showToast(t.cacheLoaded.replace('{count}', loadedCacheCount));
        // Si des stats étaient déjà affichées, mettre à jour leurs noms
        updateLoadedPlayersNames();
    }

    // Si on n'a que des fichiers cache déposés, on s'arrête là
    if (statsFiles.length === 0) {
        renderPlayerList(playerSearch.value.toLowerCase());
        if (activeUUID) updatePlayerBannerUI(activeUUID);
        return;
    }

    // 3. Traiter les fichiers de stats
    header.classList.add('minimized');
    mainContent.style.display = 'flex';

    for (const f of statsFiles) {
        try {
            const rawName = f.name.replace(/\.json$/i, '');
            const content = await f.text();
            const json = JSON.parse(content);

            // Vérifier s'il s'agit bien d'un fichier stats Minecraft
            const statsObj = json.stats || json;
            if (!statsObj || typeof statsObj !== 'object') continue;

            const uuid = formatUUID(rawName);
            const type = getPlayerAccountType(uuid);

            // Vérifier si le nom est déjà dans notre cache persistant
            const cachedName = getStoredName(uuid);

            let initialName;
            if (cachedName) {
                initialName = cachedName;
            } else if (type === 'offline') {
                // Pour les joueurs offline, NE PAS appeler PlayerDB (qui échoue toujours et marquait "Inconnu")
                initialName = `${t.unknownOffline} #${uuid.substring(0, 8)}`;
            } else if (type === 'bedrock') {
                initialName = `${t.unknownBedrock} #${uuid.substring(0, 8)}`;
            } else {
                // Compte premium v4 : temporairement les 8 premiers caractères, puis résolution en ligne
                initialName = uuid.substring(0, 8) + '...';
            }

            allPlayersData[uuid] = {
                uuid: uuid,
                name: initialName,
                type: type,
                stats: statsObj,
                hasRealName: Boolean(cachedName)
            };

            // Pour les comptes premium officiels sans nom en cache : résolution asynchrone via PlayerDB
            if (type === 'premium' && !cachedName) {
                resolvePremiumPlayerName(uuid);
            }
        } catch (err) {
            console.warn("Fichier ignoré car non valide :", f.name, err);
        }
    }

    renderPlayerList(playerSearch.value.toLowerCase());

    // Sélectionner automatiquement le premier joueur si aucun n'est sélectionné
    const playerKeys = Object.keys(allPlayersData);
    if (playerKeys.length > 0 && (!activeUUID || !allPlayersData[activeUUID])) {
        showPlayer(playerKeys[0]);
    }
}

// Extraction des pseudos depuis un usercache.json, whitelist.json, ops.json ou usernamecache
function extractNamesFromJson(json) {
    let count = 0;
    const mapping = {};

    if (Array.isArray(json)) {
        for (const item of json) {
            if (item && item.uuid && item.name) {
                mapping[item.uuid] = item.name;
                count++;
            }
        }
    } else if (typeof json === 'object' && json !== null) {
        for (const [key, val] of Object.entries(json)) {
            if (typeof val === 'string' && (key.includes('-') || key.length === 32)) {
                // Format { "uuid": "Pseudo" }
                mapping[key] = val;
                count++;
            } else if (typeof val === 'string' && (val.includes('-') || val.length === 32)) {
                // Format { "Pseudo": "uuid" }
                mapping[val] = key;
                count++;
            }
        }
    }

    if (count > 0) {
        storeMultipleNames(mapping);
    }
    return count;
}

// Met à jour les noms de tous les joueurs chargés à partir du cache local
function updateLoadedPlayersNames() {
    for (const [uuid, p] of Object.entries(allPlayersData)) {
        const cached = getStoredName(uuid);
        if (cached) {
            p.name = cached;
            p.hasRealName = true;
        }
    }
    renderPlayerList(playerSearch.value.toLowerCase());
    if (activeUUID && allPlayersData[activeUUID]) {
        updatePlayerBannerUI(activeUUID);
    }
}

// Résolution API sécurisée pour les comptes Premium v4
async function resolvePremiumPlayerName(uuid) {
    try {
        const res = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        if (data && data.success && data.data && data.data.player && data.data.player.username) {
            const username = data.data.player.username;
            if (allPlayersData[uuid]) {
                allPlayersData[uuid].name = username;
                allPlayersData[uuid].hasRealName = true;
                storePlayerName(uuid, username);
                renderPlayerList(playerSearch.value.toLowerCase());
                if (activeUUID === uuid) updatePlayerBannerUI(uuid);
            }
        }
    } catch {
        // Fallback discret sur l'UUID abrégé si hors-ligne ou erreur réseau
        if (allPlayersData[uuid] && !allPlayersData[uuid].hasRealName) {
            const t = i18n[langSelect.value] || i18n.fr;
            allPlayersData[uuid].name = `${t.unknownPremium} #${uuid.substring(0, 8)}`;
            renderPlayerList(playerSearch.value.toLowerCase());
            if (activeUUID === uuid) updatePlayerBannerUI(uuid);
        }
    }
}

// URL de l'avatar du joueur avec fallback
function getPlayerAvatarUrl(player) {
    if (player.hasRealName && player.name) {
        return `https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/64`;
    }
    if (player.type === 'premium') {
        return `https://mc-heads.net/avatar/${player.uuid}/64`;
    }
    return STEVE_AVATAR;
}

// --- AFFICHAGE DE LA LISTE DES JOUEURS ---
playerSearch.oninput = () => renderPlayerList(playerSearch.value.toLowerCase().trim());

function renderPlayerList(filter = "") {
    playersUl.innerHTML = "";
    const sorted = Object.keys(allPlayersData).sort((a, b) =>
        allPlayersData[a].name.localeCompare(allPlayersData[b].name)
    );

    const t = i18n[langSelect.value] || i18n.fr;

    sorted.forEach(uuid => {
        const p = allPlayersData[uuid];
        const nameMatches = p.name.toLowerCase().includes(filter);
        const uuidMatches = uuid.toLowerCase().includes(filter);
        if (filter && !nameMatches && !uuidMatches) return;

        const li = document.createElement('li');
        if (uuid === activeUUID) li.className = "active";

        // Avatar
        const img = document.createElement('img');
        img.className = 'player-item-avatar';
        img.src = getPlayerAvatarUrl(p);
        img.onerror = () => { img.src = STEVE_AVATAR; };
        img.alt = p.name;

        // Informations
        const infoDiv = document.createElement('div');
        infoDiv.className = 'player-item-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-item-name';
        nameSpan.innerText = p.name;

        const subDiv = document.createElement('div');
        subDiv.className = 'player-item-sub';

        // Badge miniature de compte
        const badge = document.createElement('span');
        badge.className = `badge badge-tiny badge-${p.type}`;
        if (p.type === 'premium') badge.innerText = t.premiumBadge;
        else if (p.type === 'offline') badge.innerText = t.offlineBadge;
        else if (p.type === 'bedrock') badge.innerText = t.bedrockBadge;
        else badge.innerText = 'MC';

        const uuidSpan = document.createElement('span');
        uuidSpan.className = 'player-item-uuid';
        uuidSpan.innerText = uuid.substring(0, 8);

        subDiv.appendChild(badge);
        subDiv.appendChild(uuidSpan);

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(subDiv);

        li.appendChild(img);
        li.appendChild(infoDiv);

        li.onclick = () => showPlayer(uuid);
        playersUl.appendChild(li);
    });
}

// --- AFFICHAGE DU JOUEUR SÉLECTIONNÉ ---
function showPlayer(uuid) {
    activeUUID = uuid;
    renderPlayerList(playerSearch.value.toLowerCase().trim());
    updatePlayerBannerUI(uuid);

    const p = allPlayersData[uuid];
    categorySelector.innerHTML = "";
    const t = i18n[langSelect.value] || i18n.fr;
    statsResults.innerHTML = `<p class="placeholder-text">${t.placeholder}</p>`;

    if (p && p.stats) {
        const categories = Object.keys(p.stats);
        categories.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = "cat-btn";
            btn.innerText = cat.split(':')[1] || cat;
            btn.onclick = () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showCategoryStats(cat);
            };
            categorySelector.appendChild(btn);

            // Activer la première catégorie par défaut
            if (index === 0) {
                btn.classList.add('active');
                showCategoryStats(cat);
            }
        });
    }
}

function updatePlayerBannerUI(uuid) {
    const p = allPlayersData[uuid];
    if (!p) return;
    const t = i18n[langSelect.value] || i18n.fr;

    currentPlayerName.innerText = p.name;
    currentPlayerUuid.innerText = uuid;
    btnEditPlayer.style.display = 'inline-flex';
    btnEditPlayer.title = t.editName;
    btnCopyUuid.style.display = 'inline-flex';

    // Badge
    playerTypeBadge.style.display = 'inline-flex';
    playerTypeBadge.className = `badge badge-${p.type}`;
    if (p.type === 'premium') {
        playerTypeBadge.innerHTML = `⭐ ${t.premiumBadge}`;
    } else if (p.type === 'offline') {
        playerTypeBadge.innerHTML = `🎮 ${t.offlineBadge}`;
    } else if (p.type === 'bedrock') {
        playerTypeBadge.innerHTML = `📱 ${t.bedrockBadge}`;
    } else {
        playerTypeBadge.style.display = 'none';
    }

    // Avatar
    currentPlayerAvatar.src = getPlayerAvatarUrl(p);
    currentPlayerAvatar.onerror = () => { currentPlayerAvatar.src = STEVE_AVATAR; };
}

// Affichage des statistiques par catégorie
function showCategoryStats(category) {
    if (!activeUUID || !allPlayersData[activeUUID]) return;
    const data = allPlayersData[activeUUID].stats[category];
    statsResults.innerHTML = "";
    if (!data) return;

    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([key, val]) => {
        const row = document.createElement('div');
        row.className = "stat-row";
        const clean = key.replace('minecraft:', '').replace(/_/g, ' ');
        row.innerHTML = `<span style="text-transform: capitalize;">${clean}</span>
                         <span class="stat-value">${val.toLocaleString()}</span>`;
        statsResults.appendChild(row);
    });
}

function editCurrentPlayer() {
    if (!activeUUID || !allPlayersData[activeUUID]) return;
    const p = allPlayersData[activeUUID];
    const t = i18n[langSelect.value] || i18n.fr;
    const currentVal = p.hasRealName ? p.name : '';
    const newName = prompt(t.promptEditName, currentVal);

    if (newName && newName.trim() !== "") {
        const cleanName = newName.trim();
        p.name = cleanName;
        p.hasRealName = true;
        storePlayerName(activeUUID, cleanName);
        updatePlayerBannerUI(activeUUID);
        renderPlayerList(playerSearch.value.toLowerCase().trim());
        showToast(t.nameUpdated);
    }
}

btnEditPlayer.onclick = editCurrentPlayer;
currentPlayerName.onclick = editCurrentPlayer;
currentPlayerName.style.cursor = 'pointer';

// Copie rapide de l'UUID
btnCopyUuid.onclick = () => {
    if (!activeUUID) return;
    const t = i18n[langSelect.value] || i18n.fr;
    navigator.clipboard.writeText(activeUUID).then(() => {
        showToast(t.uuidCopied);
    }).catch(() => {
        showToast(activeUUID);
    });
};
