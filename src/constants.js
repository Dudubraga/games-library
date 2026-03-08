export const PLATFORMS = [
  { id: 'steam', label: 'Steam',      ico: '🎮' },
  { id: 'epic',  label: 'Epic Games', ico: '⚡' },
  { id: 'web',   label: 'Web',        ico: '🌐' },
  { id: 'outro', label: 'Outro',      ico: '📦' },
];

export const ALL_CATEGORIES = [
  'Party Games', 'Coop', 'Tabuleiro', 'Puzzle', 'Arcade',
  'Ação', 'Aventura', 'Terror', 'Estratégia', 'Plataforma',
  'RPG', 'Simulação', 'Corrida', 'Esporte', 'Indie',
];

export const INITIAL_GAMES = [
  {
    id: '1', title: 'Lethal Company', platform: 'steam',
    categories: ['Terror', 'Coop'],
    cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1966720/library_600x900.jpg',
  },
  {
    id: '2', title: 'Gartic Phone', platform: 'web',
    categories: ['Party Games'],
    cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1913870/library_600x900.jpg',
  },
  {
    id: '3', title: 'UNO', platform: 'steam',
    categories: ['Party Games', 'Tabuleiro'],
    cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/470220/library_600x900.jpg',
  },
  {
    id: '4', title: "Liar's Bar", platform: 'steam',
    categories: ['Party Games', 'Estratégia'],
    cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3097560/library_600x900.jpg',
  },
];

export const WHEEL_COLORS = [
  '#e63946','#2a9d8f','#e9c46a','#264653','#f4a261',
  '#6a4c93','#0096c7','#80b918','#c77dff','#ff6b6b',
  '#48cae4','#f77f00','#1b4332','#b5838d','#52b788',
];
