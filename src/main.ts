import "./style.css";

type Rarity = "SSR" | "SR" | "R";

interface Character {
  name: string;
  title: string;
  rarity: Rarity;
  element: string;
  symbol: string;
  description: string;
  color: string;
}

interface DrawResult extends Character {
  id: number;
  isNew: boolean;
  time: string;
}

interface SavedState {
  crystals: number;
  totalPulls: number;
  pity: number;
  collection: string[];
  history: DrawResult[];
}

const characters: Character[] = [
  { name: "流光", title: "星海观测者", rarity: "SSR", element: "星", symbol: "✦", description: "在星尘之间寻找失落的航路。", color: "#f5c86a" },
  { name: "烬羽", title: "赤焰旅人", rarity: "SSR", element: "火", symbol: "♨", description: "将最后一簇火焰留给黎明。", color: "#ff826f" },
  { name: "霜铃", title: "雪原守望者", rarity: "SSR", element: "冰", symbol: "❄", description: "她的铃声能让风雪安静下来。", color: "#9bdcff" },
  { name: "月见", title: "月下织梦人", rarity: "SR", element: "月", symbol: "☾", description: "把未说出口的愿望织进梦里。", color: "#c4a5ff" },
  { name: "青禾", title: "森林信使", rarity: "SR", element: "木", symbol: "❋", description: "熟悉每一条被藤蔓遮住的小路。", color: "#8ee0b1" },
  { name: "千帆", title: "远洋领航员", rarity: "SR", element: "海", symbol: "≈", description: "地图的边界，是新的起点。", color: "#8dbbff" },
  { name: "星野", title: "见习记录员", rarity: "R", element: "星", symbol: "✧", description: "认真记录旅途中每个小小奇迹。", color: "#c5c8df" },
  { name: "小满", title: "花圃管理员", rarity: "R", element: "木", symbol: "❀", description: "今天也有好好照顾每一株花。", color: "#c5c8df" },
  { name: "阿澈", title: "港湾修理师", rarity: "R", element: "海", symbol: "⌁", description: "没有修不好的旧收音机。", color: "#c5c8df" },
  { name: "砾", title: "遗迹拾荒者", rarity: "R", element: "地", symbol: "◇", description: "总能从废墟里找到有用的东西。", color: "#c5c8df" },
];

const SAVE_KEY = "demo3-gacha-save-v1";
const STARTING_CRYSTALS = 1600;
const TEN_PULL_COST = 1600;
const SINGLE_PULL_COST = 160;
const SSR_RATE = 0.03;
const SR_RATE = 0.12;
const PITY_LIMIT = 50;

const defaultState: SavedState = {
  crystals: STARTING_CRYSTALS,
  totalPulls: 0,
  pity: 0,
  collection: [],
  history: [],
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultState, collection: [], history: [] };
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      crystals: typeof parsed.crystals === "number" ? parsed.crystals : STARTING_CRYSTALS,
      totalPulls: typeof parsed.totalPulls === "number" ? parsed.totalPulls : 0,
      pity: typeof parsed.pity === "number" ? parsed.pity : 0,
      collection: Array.isArray(parsed.collection) ? parsed.collection : [],
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 30) : [],
    };
  } catch {
    return { ...defaultState, collection: [], history: [] };
  }
}

let state = loadState();
let nextResultId = Date.now();
let activeTab: "summon" | "collection" | "history" = "summon";
let latestResults: DrawResult[] = [];
let notice = "欢迎来到星屑档案。第一次相遇，就从这里开始。";

function saveState(): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

function pickCharacter(): Character {
  const roll = Math.random();
  const rarity: Rarity = roll < SSR_RATE ? "SSR" : roll < SSR_RATE + SR_RATE ? "SR" : "R";
  const pool = characters.filter((character) => character.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function performDraw(count: 1 | 10): void {
  const cost = count === 10 ? TEN_PULL_COST : SINGLE_PULL_COST;
  if (state.crystals < cost) {
    notice = "星晶不足。可以重置模拟数据，再试一次。";
    render();
    return;
  }

  state.crystals -= cost;
  const results: DrawResult[] = [];

  for (let i = 0; i < count; i += 1) {
    state.totalPulls += 1;
    let character = pickCharacter();
    state.pity += 1;

    if (state.pity >= PITY_LIMIT && character.rarity !== "SSR") {
      const ssrPool = characters.filter((item) => item.rarity === "SSR");
      character = ssrPool[Math.floor(Math.random() * ssrPool.length)]!;
    }

    if (character.rarity === "SSR") state.pity = 0;
    results.push({
      ...character,
      id: nextResultId++,
      isNew: false,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
  }

  // 十连保底：如果没有 SR 或 SSR，把最后一张替换为 SR。
  if (count === 10 && !results.some((item) => item.rarity !== "R")) {
    const srPool = characters.filter((item) => item.rarity === "SR");
    const guaranteed = srPool[Math.floor(Math.random() * srPool.length)]!;
    const previous = results[results.length - 1]!;
    results[results.length - 1] = {
      ...guaranteed,
      id: previous.id,
      isNew: false,
      time: previous.time,
    };
  }

  // Update the collection only after applying the ten-pull guarantee.
  for (const result of results) {
    result.isNew = !state.collection.includes(result.name);
    if (result.isNew) state.collection.push(result.name);
  }
  state.history = [...results.slice().reverse(), ...state.history].slice(0, 30);
  latestResults = results;
  notice = count === 10 ? "十连召唤完成！至少获得一位 SR 或更高稀有度角色。" : "召唤完成，愿星光与你同行。";
  saveState();
  render();
}

function rarityClass(rarity: Rarity): string {
  return rarity.toLowerCase();
}

function renderResultCard(result: DrawResult, index: number): string {
  return `
    <article class="character-card ${rarityClass(result.rarity)}" style="--accent:${result.color};--delay:${index * 45}ms">
      <div class="card-top"><span>${result.rarity}</span><span>${escapeHtml(result.element)}属性</span></div>
      <div class="character-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span>${result.symbol}</span></div>
      <div class="card-info">
        <div class="character-title">${escapeHtml(result.title)}</div>
        <div class="character-name">${escapeHtml(result.name)}</div>
        <p>${escapeHtml(result.description)}</p>
      </div>
      ${result.isNew ? '<span class="new-tag">NEW</span>' : ""}
    </article>`;
}

function renderSummon(): string {
  const resultsMarkup = latestResults.length
    ? `<div class="results-grid ${latestResults.length === 1 ? "single-result" : ""}">${latestResults.map(renderResultCard).join("")}</div>`
    : `<div class="empty-stage"><div class="big-star">✧</div><p>星海静候你的召唤</p><span>每一次相遇，都是故事的开始。</span></div>`;

  return `
    <section class="banner">
      <div class="banner-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span> LIMITED WISH · 模拟卡池</div>
        <h2>星夜的<span>回响</span></h2>
        <p>穿过遥远的星云，与命运中尚未相识的旅人相遇。</p>
        <div class="banner-meta"><span>✦ 原创角色卡池</span><span>∞ 纯模拟体验</span></div>
      </div>
      <div class="banner-art" aria-hidden="true"><div class="planet planet-back"></div><div class="planet planet-front"></div><div class="banner-spark spark-a">✦</div><div class="banner-spark spark-b">✧</div><div class="banner-spark spark-c">✦</div></div>
    </section>
    <section class="summon-layout">
      <div class="results-panel panel">
        <div class="panel-heading"><div><div class="section-kicker">YOUR DESTINY</div><h3>${latestResults.length ? "召唤结果" : "等待召唤"}</h3></div><span class="result-count">${latestResults.length ? `本次 ${latestResults.length} 位` : "READY"}</span></div>
        ${resultsMarkup}
        <p class="notice" role="status">${escapeHtml(notice)}</p>
      </div>
      <aside class="summon-sidebar">
        <div class="panel resource-panel">
          <div class="section-kicker">YOUR RESOURCE</div><div class="resource-label">✧ 星晶余额</div>
          <div class="crystal-count">${state.crystals.toLocaleString("zh-CN")} <span>✦</span></div>
          <div class="resource-foot"><span>累计召唤</span><strong>${state.totalPulls}</strong></div>
          <div class="resource-foot"><span>距 SSR 保底</span><strong>${PITY_LIMIT - state.pity} 抽</strong></div>
          <div class="pity-track"><div style="width:${Math.min(100, state.pity / PITY_LIMIT * 100)}%"></div></div>
        </div>
        <div class="panel rates-panel">
          <div class="section-kicker">DROP RATES</div><h3>概率公示</h3>
          <div class="rate-row"><span class="rate-dot ssr-dot"></span><span>SSR · 星耀</span><strong>3%</strong></div>
          <div class="rate-row"><span class="rate-dot sr-dot"></span><span>SR · 闪光</span><strong>12%</strong></div>
          <div class="rate-row"><span class="rate-dot r-dot"></span><span>R · 常驻</span><strong>85%</strong></div>
          <p class="fine-print">第 50 抽必得 SSR；十连至少获得 1 位 SR 或 SSR。仅为本页面的模拟规则。</p>
        </div>
        <div class="draw-actions">
          <button class="draw-button single-button" data-action="single"><span>✧</span><span>召唤 1 次<small>消耗 160 星晶</small></span></button>
          <button class="draw-button ten-button" data-action="ten"><span>✦</span><span>召唤 10 次<small>消耗 1,600 星晶</small></span></button>
        </div>
        <button class="text-button" data-action="reset">↻ 重置模拟数据</button>
      </aside>
    </section>`;
}

function renderCollection(): string {
  const collected = characters.filter((item) => state.collection.includes(item.name));
  return `
    <section class="panel collection-panel">
      <div class="panel-heading"><div><div class="section-kicker">STAR ATLAS</div><h3>角色图鉴</h3><p class="subheading">已发现 ${collected.length} / ${characters.length} 位旅人</p></div><span class="collection-progress">${Math.round(collected.length / characters.length * 100)}%</span></div>
      <div class="collection-grid">${characters.map((character) => {
        const owned = state.collection.includes(character.name);
        return `<article class="collection-card ${owned ? rarityClass(character.rarity) : "locked"}" style="--accent:${character.color}">
          <div class="collection-symbol">${owned ? character.symbol : "?"}</div>
          <div><span class="mini-rarity">${owned ? character.rarity : "未发现"}</span><h4>${owned ? escapeHtml(character.name) : "未知旅人"}</h4><p>${owned ? escapeHtml(character.title) : "召唤后解锁档案"}</p></div>
        </article>`;
      }).join("")}</div>
    </section>`;
}

function renderHistory(): string {
  return `
    <section class="panel history-panel">
      <div class="panel-heading"><div><div class="section-kicker">MEMORY FRAGMENTS</div><h3>召唤记录</h3><p class="subheading">最近 ${state.history.length} 次结果 · 最多保留 30 条</p></div></div>
      ${state.history.length ? `<div class="history-list">${state.history.map((item) => `
        <div class="history-row">
          <div class="history-symbol" style="--accent:${item.color}">${item.symbol}</div>
          <div class="history-person"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.title)}</span></div>
          <span class="history-rarity ${rarityClass(item.rarity)}">${item.rarity}</span>
          <time>${escapeHtml(item.time)}</time>
        </div>`).join("")}</div>` : '<div class="empty-history">还没有召唤记录，去遇见第一位旅人吧。 ✧</div>'}
    </section>`;
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a href="#" class="brand" data-action="home" aria-label="星屑档案首页"><span class="brand-mark">✦</span><span>星屑<span class="brand-light">档案</span><small>ASTRAL ARCHIVE</small></span></a>
        <nav class="main-nav" aria-label="主导航">
          <button class="nav-link ${activeTab === "summon" ? "active" : ""}" data-tab="summon">星愿召唤</button>
          <button class="nav-link ${activeTab === "collection" ? "active" : ""}" data-tab="collection">角色图鉴 <span>${state.collection.length}</span></button>
          <button class="nav-link ${activeTab === "history" ? "active" : ""}" data-tab="history">召唤记录</button>
        </nav>
        <div class="profile-chip"><span class="profile-avatar">✧</span><span>星旅者<small>新手档案</small></span></div>
      </header>
      <main>
        ${activeTab === "summon" ? renderSummon() : activeTab === "collection" ? renderCollection() : renderHistory()}
      </main>
      <footer><span>✦ 星屑档案 · ASTRAL ARCHIVE</span><span>纯前端抽卡模拟器 · 数据保存在当前浏览器</span></footer>
    </div>`;

  app.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab as typeof activeTab;
      render();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "single") performDraw(1);
      if (action === "ten") performDraw(10);
      if (action === "home") {
        activeTab = "summon";
        latestResults = [];
        render();
      }
      if (action === "reset") {
        if (window.confirm("确定重置星晶、抽卡记录和角色图鉴吗？此操作无法撤销。")) {
          state = { ...defaultState, collection: [], history: [] };
          latestResults = [];
          notice = "档案已重置，新的星旅即将开始。";
          saveState();
          render();
        }
      }
    });
  });
}

render();