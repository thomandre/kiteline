# Kiteline — analyse des simplifications vs réalité

Confronte le modèle du jeu (`kiteline-3d.html`) à `kitesurf-physique.md`.
Pour chaque point : ce que fait le code, l'écart avec le réel, la gravité, une piste.

Légende gravité : 🟢 acceptable (choix de jeu) · 🟡 perfectible · 🔴 faux/gênant.

---

## A. Fenêtre de vent — **modèle 1D** 🔴 (le plus gros raccourci)

- **Code** : l'aile est paramétrée par un seul scalaire `G.kite` (0–165°) = un arc
  *vertical* dans le plan du vent (bas-downwind → zénith → upwind). `kite.position` +
  base orthonormée pour l'orientation, avec un `bank` visuel ajouté.
- **Réel** : la fenêtre est **2D** (azimut gauche/droite × élévation). On envoie l'aile
  en diagonale, on la loope sur un côté, on la pique à 1 h ou 11 h.
- **Conséquence** : pas de vrai « send » diagonal, pas de choix du côté de loop, le
  banking est un artifice plaqué (l'aile ne va pas réellement sur le côté).
- **Piste** : passer `G.kite` à un vecteur 2D `(azimut, élévation)` sur la sphère ; les
  touches ◀▶ sur l'aile (quand on ne dirige pas la planche) déplaceraient l'azimut.
  Refonte moyenne mais c'est *le* saut de réalisme.

## B. Polaire de vitesse `pointEff` 🟡

- **Code** : `pointEff(heading, edging)` = courbe ~0,7 plein vent arrière, max au largue
  (~65°), nulle à 140° (160° en bordant). Pas de vent apparent explicite.
- **Réel** : la vitesse vient du vent **apparent** (boucle de rétroaction vitesse→vent
  apparent→traction→vitesse). La courbe actuelle est une approximation raisonnable du
  résultat, mais elle ne « s'emballe » pas comme le vent apparent réel au largue.
- **Gravité** : 🟡 le ressenti est bon, la cause est fausse.
- **Piste** : calculer un vent apparent `Wa = Wreal - Vrider` et en tirer puissance/cap.

## C. Puissance & portance d'aile `powerAt` / `liftAt` 🟡

- **Code** : `powerAt(kite)` pique à 38° (zone de puissance), `liftAt(kite)` pique à 90°
  (zénith). Fonctions cosinus d'une seule variable (position dans l'arc).
- **Réel** : puissance = angle d'attaque (border/choquer) × position × vent apparent². Le
  jeu **confond position dans la fenêtre et angle d'attaque** : border/choquer (barre
  in/out) n'existe pas comme axe séparé — on n'a que « monter/descendre l'aile ».
- **Gravité** : 🟡 jouable, mais tout le registre *trim/depower* manque.
- **Piste** : ajouter un axe de bordage (barre in/out) distinct de la hauteur d'aile.

## D. Direction : planche vs barre 🟢 (corrigé récemment)

- **Code** : ◀▶ tournent `G.heading` (la planche/le cap). La barre et les bras ne
  réagissent **qu'au pilotage d'aile** (▲▼ via `kiteVel`), plus au cap. ✅ conforme.
- **Réel** : idem — le cap vient de la planche, la barre pilote l'aile.
- Reste 🟡 : le carving n'a pas d'inertie/dérapage ; `heading` tourne « au moteur ».

## E. Le saut / pop `land()` + bloc pop 🟡

- **Code** : le pop = fonction de `load` (charge de carre), `lift` (hauteur d'aile) et
  surtout `send = kiteVel/70` (vitesse d'envoi de l'aile) → il faut *envoyer* l'aile, pas
  la parker. Hangtime via `G.lift` qui réduit la gravité et tire sous le vent. ✅ bonne
  intention.
- **Réel** : le pop vient du **relâchement de la carre chargée** (énergie élastique
  lignes+planche) synchronisé avec le redirect d'aile. Le jeu a les deux ingrédients
  (charge + envoi) mais les combine de façon empirique.
- **Gravité** : 🟡 le *gameplay* du timing est là ; la magnitude (hauteur en m) est
  crédible pour un bon rider (3–8 m), pas niveau pro (20 m+).

## F. Redémarrage assis `G.sat` 🟢

- **Code** : caler face au vent → assis dans l'eau ; il faut **piquer l'aile (▼)** dans
  la zone de puissance pour se faire tracter dehors. Actif, pas de timer. ✅ fidèle à
  l'esprit du water start.
- 🟡 : en vrai on pique l'aile **d'un côté** (2D) ; ici c'est « vers le bas » (1D).

## G. Orientation & banking de l'aile 🟡

- **Code** : base orthonormée + `bank` qui incline l'envergure vers la verticale quand
  l'aile descend. Visuellement proche.
- **Réel** : conséquence directe de la position 2D sur la sphère ; ici c'est reconstruit
  à la main faute de modèle 2D (cf. A). Correct à l'œil, faux dans la structure.

## H. Lignes / barre / bras 🟢🟡

- **Code** : 4 lignes en Y (2 avant depuis le chicken-loop, 2 arrière vers les oreilles),
  attachées aux vrais bouts de la barre animée ; anti-croisement par ré-appariement.
- **Réel** : conforme dans le principe. 🟡 les lignes sont droites (pas de caténaire/flèche),
  et le chicken-loop/depower n'est pas modélisé.

## I. Hydro de la planche 🟡

- **Code** : `edging` augmente `load` et freine ; le pop consomme `load`. Pas de vraie
  portance de planche ni de dérapage.
- **Réel** : la carre crée une résistance latérale (cap au vent) et une portance ; le
  planning dépend de la vitesse. Le jeu résume tout ça à `load` + `speed`.

## J. Mer & environnement 🟢 (bon niveau)

- Houle animée synchronisée JS↔shader, déferlantes procédurales sur les hauts-fonds,
  Fresnel, translucidité, gerbes de gouttes à taille variable, océan infini (maillage qui
  suit le rider, fond marin en GLSL). Fidélité visuelle correcte ; la houle n'agit pas sur
  la physique de navigation (pas de bosses qui lancent), c'est surtout cosmétique 🟡.

## K. Géométrie du rider / matériel 🟡→🟢 (en cours d'assainissement)

- Rig reconstruit depuis `RIG` (constantes testées : membres continus, pieds parallèles
  dans la largeur de planche). Formes rondes pour ce qui est rond (pilotis, barre, harnais,
  chaussons) ; boîtes seulement pour ce qui est plat/rectangulaire (planche, ailerons,
  panneaux d'aile, deck, lettres, cheveux-nappes). Aile/planche stylées « matériel 2018 ».
- 🟡 restes : buste de profil approximé (angle fixé, ne suit pas exactement l'aile),
  mains pas en IK sur la barre/planche, épave encore boîteuse.

---

## Priorités si on veut plus de réalisme

1. 🔴 **Fenêtre de vent 2D** (A, G) — débloque send diagonal, vrais loops, banking réel.
2. 🟡 **Vent apparent explicite** (B, C) — cause physique correcte de la vitesse et du
   registre de puissance.
3. 🟡 **Axe de bordage/depower** (C) — border/choquer distinct de la hauteur d'aile.
4. 🟡 **Hydro de planche** (I) — carve avec inertie, dérapage, planning.
5. 🟢 **Finitions rig** (K) — IK mains sur barre/planche, épave sculptée.

Chaque item est isolable ; (1) est le plus structurant et le plus coûteux.
