# Kitesurf — dynamiques, physique et positionnement du corps

Document de référence pour Kiteline. Objectif : décrire ce qui se passe *réellement*
en kitesurf, pour ensuite juger (voir `analyse-code.md`) où le jeu simplifie.

---

## 1. La fenêtre de vent (wind window)

L'aile vole au bout de lignes de ~20–24 m, sur une portion de sphère centrée sur le
rider : la **fenêtre de vent**. Le vent souffle dans le dos du rider vers cette fenêtre.

- **Zénith (12 h)** : aile à la verticale au-dessus. Traction quasi verticale, peu de
  puissance propulsive → position de repos / de saut haut.
- **Bord de fenêtre (3 h et 9 h, et le pourtour)** : aile en bordure, lignes tendues
  mais peu de puissance. C'est là qu'on **borde** pour tenir un cap ou remonter au vent.
- **Zone de puissance (power zone, ~45° bas, entre 10 h–11 h et 1 h–2 h)** : l'aile y
  développe sa traction maximale. On y **envoie** l'aile pour sauter ou accélérer.
- **Point neutre / fenêtre morte** : pile sous le vent, en bordure basse ; l'aile
  perd sa portance (elle « décroche » et tombe si on l'y laisse trop).

Point clé : **la fenêtre est en 2D** (azimut gauche/droite × élévation bas/haut).
Piloter l'aile = la déplacer dans ce plan sphérique.

## 2. Vent réel vs vent apparent

La grande subtilité : l'aile ne vit pas dans le vent réel mais dans le **vent apparent**
= vent réel + vent créé par le déplacement du rider.

- En **vent arrière (downwind)**, on avance très bien : la traction de l'aile plus la
  vitesse du rider créent un vent apparent fort. On n'est *pas* limité comme un bateau.
- On peut **remonter au vent (upwind)** en bordant l'aile en bord de fenêtre et en
  mettant la planche sur la **carre** (edging) : la résistance latérale de la planche
  transforme la traction en cap au vent. Un bon rider remonte à ~40–45° du lit du vent.
- Face au vent pur (dans le lit) : impossible d'avancer, l'aile n'a plus d'angle utile.

## 3. L'aile (bow / delta / SLE moderne)

Composants :
- **Bord d'attaque (boudin, leading edge)** : tube gonflé qui donne la forme et fait
  flotter l'aile. À plat au zénith, il **s'incline vers la verticale** quand l'aile
  descend sur un côté de la fenêtre (l'aile banque).
- **Lattes (struts)** : tubes transversaux qui tendent la toile (canopy).
- **Canopy** : la toile, fine membrane.
- **Bridas + lignes** : 2 lignes **avant** (au centre, portent la charge, reliées au
  chicken-loop/harnais) et 2 lignes **arrière** (aux oreilles/wingtips, reliées aux
  bouts de barre → elles **dirigent** l'aile).

Contrôles :
- **Border/choquer (sheeting, barre in/out)** = régler l'**angle d'attaque** donc la
  **puissance**. Border (tirer la barre à soi) = plus de puissance ; choquer (pousser) =
  depower.
- **Tourner la barre (une main tire)** = tension différentielle sur les lignes arrière →
  l'aile **pivote** dans la fenêtre (monter, descendre, looper).
- **Depower / trim** : sangle qui règle la longueur relative avant/arrière pour choisir
  la plage de puissance de base.

Important : **la direction du RIDER n'est pas donnée par la barre**. La barre pilote
l'**aile**. Le cap du rider vient de la **planche** (carre + appuis).

## 4. La planche : twin-tip

- **Plate**, symétrique (twin-tip = deux spatules identiques), léger rocker.
- **Straps** (ou boots) montés en travers : les **pieds sont parallèles**, orientés vers
  les carres, écartés d'une largeur d'épaules le long de l'axe.
- **Carres (rails)** + petits **ailerons** : mettre la planche sur la carre (edging) crée
  la résistance latérale qui permet de tenir/remonter au vent et de **charger** avant un
  saut.

## 5. Position du corps (la « stance »)

C'est là que Kiteline péchait le plus. En navigation établie :

- **De profil** : le rider est de côté par rapport à sa trajectoire, le buste face au
  vent/à l'aile. Épaules ~alignées avec la planche, hanches et regard vers l'aile.
- **Assis dans le harnais** : la traction passe par le **crochet/spreader bar** au niveau
  du bassin, pas par les bras. Le rider est **en appui arrière**, fesses basses, comme
  suspendu à un siège invisible tiré vers l'aile.
- **Bras relâchés**, légèrement fléchis sur la barre : ils ne tiennent presque pas la
  charge, ils font de petits ajustements (border/choquer, tourner). Les mouvements de
  barre sont **faibles**.
- **Jambes fléchies**, poids majoritairement sur le **pied arrière** et sur les **talons**
  (navigation heelside classique) pour mettre la carre au vent.
- **Regard** vers l'aile / là où l'on va.

Résumé biomécanique : *hanches en arrière, buste de profil vers l'aile, bras souples,
jambes fléchies qui poussent sur la carre, harnais qui encaisse.*

## 6. Le saut (big air)

Séquence réelle :
1. **Vitesse** au largue/travers, aile parkée vers ~10 h–11 h (ou 1 h–2 h).
2. **Charger la carre** : on met fort la planche sur la carre au vent, bas du corps
   engagé → on « bande » les lignes.
3. **Envoyer l'aile (send/redirect)** : on tire la barre pour envoyer l'aile *rapidement*
   vers le zénith en passant par la zone de puissance. C'est le geste-clé.
4. **Pop / edge release** : au bon instant (aile presque au zénith, lignes chargées), on
   relâche la carre → on est catapulté vers le haut.
5. **Hangtime** : on garde l'aile haute (~12 h), elle nous **suspend** et nous tire un
   peu sous le vent → on flotte longtemps et loin.
6. **Réception** : on redescend l'aile vers ~10 h/2 h pour se réaccélérer, on pose planche
   à plat pointée légèrement sous le vent, jambes qui amortissent.

Le **timing** est tout : envoyer trop tôt/tard = petit saut. Parker l'aile au zénith
*sans l'envoyer* ne saute pas — il faut le mouvement dynamique.

## 7. Le kiteloop

Au lieu de renvoyer l'aile au zénith après l'envoi, on la fait **boucler** à travers la
zone de puissance : énorme accélération vers l'avant et le bas. Fait en haut d'un saut,
c'est spectaculaire et engagé (risque de se faire « planter »).

## 8. Water start / redémarrage

À l'arrêt (chute, ou départ), on est **assis dans l'eau**. Pour repartir :
- On stabilise l'aile au zénith, puis on la **pique** dans la zone de puissance d'un côté
  (petit coup de barre) → la traction nous sort de l'eau, on met la planche sous les pieds
  et on abat pour lancer. C'est un geste **actif** de pilotage d'aile, pas automatique.

## 9. Chutes

- **Aile qui tombe** : si on la laisse au bord bas de fenêtre sans vitesse, elle décroche
  et tombe à l'eau ; relance en la ramenant dans la fenêtre.
- **Se faire planter** : mauvais timing (loop, réception face au vent) → on part à l'eau.
- **Toucher un haut-fond / la plage** : le rider tombe, se fait mal ; le courant le
  ramène vers l'eau navigable.

## 10. Forces en jeu (bilan)

- **Traction de l'aile** T le long des lignes (direction = vers l'aile dans la fenêtre),
  d'intensité fonction de (puissance = angle d'attaque × position dans la fenêtre) × vent
  apparent².
- **Résistance hydrodynamique de la planche** : portance de planche + résistance de carre
  (edging) ; c'est elle qui convertit T en cap et qui, chargée puis relâchée, donne le pop.
- **Poids** du rider.
- **Traînée aéro** du rider.
- L'équilibre en navigation : composante horizontale de T ≈ résistance d'avancement ;
  composante verticale de T + portance planche ≈ poids ; le rider s'incline pour équilibrer
  le moment de T autour de ses appuis (d'où l'appui arrière « suspendu »).
