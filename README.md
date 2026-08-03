# KITELINE

Jeu de kitesurf 3D dans le navigateur — un seul fichier, WebGL (three.js), physique de
navigation crédible et rendu stylisé.

**Jouer** : ouvrir `kiteline-3d.html` (ou la page publiée). Sur desktop, clavier ; sur
mobile, pad tactile.

## Contrôles

- `← →` : cap (la planche / le carving)
- `↑ ↓` : piloter l'aile (monter / piquer) — l'aile n'est jamais stable, corrige sans cesse
- `Espace` : carre (charger les lignes) — relâcher pour décoller
- `Q S D F` (AZERTY) : spin · roll · grab · pass ; en l'air, `grab + direction` choisit la prise
- `Maj` : kiteloop (jauge pleine) · `R` : recommencer

## Développement

- `npm install`
- `npm run serve` puis ouvrir http://localhost:8123/kiteline-3d.html
- `npm test` : suite Cypress (contrôles, gameplay, anatomie du rider, captures visuelles)

## Docs

- `docs/kitesurf-physique.md` — dynamiques réelles du kitesurf
- `docs/analyse-code.md` — écarts entre le modèle du jeu et la réalité

🤖 Développé avec [Claude Code](https://claude.com/claude-code)
