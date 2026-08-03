# Position du kiter — recherche (littérature) et application au rig

Recherche pour affiner la stance du rider dans Kiteline. Sources en bas.

## Ce que dit la littérature (navigation établie, heelside)

**Épaules**
- Roulées en arrière, omoplates légèrement resserrées (posture ouverte).
- Inclinées vers l'arrière pour mettre le poids sur la **carre talon** → augmente l'edging
  et permet de résister à la traction sous le vent.
- Tournées avec la tête pour **regarder vers l'endroit où l'on va** (rotation du buste),
  ce qui met plus de pression sur le talon du pied arrière et fait remonter au vent.

**Hanches**
- **Poussées vers la barre / l'aile**, PAS en position assise (« ne pas s'asseoir »).
- Hanche arrière avancée vers l'aile.
- Bien placées, elles dirigent la traction de l'aile dans la carre talon.

**Poids / appuis**
- Tête face au vent, épaules en arrière, hanches en avant → le **poids est sur la jambe
  arrière**, la pression passe par le **talon**.
- **Jambe arrière fléchie**, supporte plus de poids que l'avant.

**Bras**
- **Relativement tendus et souples** ; ils ne portent presque pas la charge (le harnais
  encaisse). Petits ajustements seulement.
- Image donnée : « presque un mouvement de rameur — épaules en arrière, bras tendus,
  ça lève les hanches et pousse la planche entre soi et l'aile ».

**Carre (edging)**
- Poids légèrement en arrière, talons pressés sur la carre → résistance dans l'eau →
  remontée au vent. Angle planche/eau modéré (≈ 20°+ en charge).

## Synthèse (à mémoriser)

> Hanches poussées vers l'aile (pas assis) · épaules/regard tournés vers l'aile ·
> poids sur la jambe arrière fléchie et sur les talons · bras tendus/souples ·
> harnais qui porte · planche sur la carre.

## Application au rig Kiteline (état actuel vs cible)

Fichier : `kiteline-3d.html`. Repères : `RIG` (squelette), `UPIV` (pivot hanches),
`upperGrp` (buste), `lean` (gîte), arms `armLGrp/armRGrp`, `barMesh`.

| Aspect | Réalité | Dans le jeu aujourd'hui | À faire |
|---|---|---|---|
| Hanches | poussées vers l'aile | bassin fixe (pivot hanches OK) | avancer le bassin vers +X (côté aile) sous charge |
| Épaules/buste | tournés vers l'aile | `upperGrp.rotation.y = (π/2−cap)×0.7` | ✔ ok, sens à re-vérifier |
| Gîte | corps incliné, planche ~20° | `rider.z=lean×0.47` (planche) + `upperGrp.z=lean×0.6` (corps) | ✔ ok |
| Jambe arrière | fléchie, chargée | jambes ~symétriques | fléchir + charger davantage la jambe arrière |
| Bras | tendus/souples sur la barre | suivent la barre (kiteVel) | ok ; les rendre un peu plus tendus |
| Harnais | porte la charge (crochet) | ceinture + crochet visuels | ok visuellement |

Piste concrète prochaine passe : décaler le bassin/`upperGrp` vers +X (leeward) avec la
charge, fléchir/charger la jambe arrière, garder les bras un peu plus tendus.

## Sources
- IKSURFMAG — Stance : https://www.iksurfmag.com/technique/beginner/stance/
- British Kitesports — Working on Your Kiteboarding Stance : https://britishkitesports.org/technique-tips-working-on-your-kiteboarding-stance/
- Session Sports — Proper Riding Stance for Kiteboarding : https://sessionsports.com/blogs/kiteboarding-tutorial/proper-riding-stance-for-kiteboarding
- thekitespot.com — 10 Steps to Kiteboard Upwind : https://thekitespot.com/10-steps-to-kiteboard-upwind/
