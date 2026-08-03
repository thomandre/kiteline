/* Vérifie que le rig du rider est anatomiquement cohérent : membres continus,
   pieds parallèles posés DANS la largeur de la planche. Ces contraintes viennent
   des constantes RIG exposées par le jeu. */

const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('anatomie du rider', () => {
  beforeEach(() => {
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
  });

  it('les pieds tiennent dans la largeur de la planche (pas d\'orteils dehors)', () => {
    cy.window().then(w => {
      const R = w.KITELINE.RIG;
      // le pied est décalé de footOffX ; son extrémité orteils doit rester dans la planche
      expect(Math.abs(R.footF[0] + R.footOffX) + R.footHalfW, 'pied avant').to.be.at.most(R.boardHalfW + 1e-6);
      expect(Math.abs(R.footB[0] + R.footOffX) + R.footHalfW, 'pied arrière').to.be.at.most(R.boardHalfW + 1e-6);
    });
  });

  it('la cheville est au talon (pied en L, pas en T symétrique)', () => {
    cy.window().then(w => {
      const R = w.KITELINE.RIG;
      // cheville (footF[0]) en arrière du centre du pied (footF[0]+footOffX) → talon court, orteils longs
      expect(R.footOffX, 'décalage orteils non nul').to.be.greaterThan(0.02);
      const heel = R.footF[0] + R.footOffX - R.footHalfW;   // extrémité talon
      const toe = R.footF[0] + R.footOffX + R.footHalfW;     // extrémité orteils
      expect(R.footF[0] - heel, 'talon court derrière la cheville').to.be.lessThan(toe - R.footF[0]);
    });
  });

  it('les pieds sont parallèles, symétriques et posés sur la planche', () => {
    cy.window().then(w => {
      const R = w.KITELINE.RIG;
      expect(R.footF[0], 'même position latérale (parallèles)').to.eq(R.footB[0]);
      expect(R.footF[2], 'écartés symétriquement le long de l\'axe').to.eq(-R.footB[2]);
      expect(R.footF[1], 'pied avant au niveau de la planche').to.be.closeTo(R.boardTop, 0.09);
      expect(R.footB[1], 'pied arrière au niveau de la planche').to.be.closeTo(R.boardTop, 0.09);
    });
  });

  it('les hanches sont connectées au bassin', () => {
    cy.window().then(w => {
      const R = w.KITELINE.RIG;
      expect(d(R.hipF, R.pelvis), 'hanche avant → bassin').to.be.lessThan(0.2);
      expect(d(R.hipB, R.pelvis), 'hanche arrière → bassin').to.be.lessThan(0.2);
    });
  });

  it('les jambes sont continues : hanche → genou → pied sans saut, genou fléchi', () => {
    cy.window().then(w => {
      const R = w.KITELINE.RIG;
      for (const s of ['F', 'B']) {
        const hip = R['hip' + s], knee = R['knee' + s], foot = R['foot' + s];
        expect(d(hip, knee), 'cuisse ' + s).to.be.within(0.3, 0.7);
        expect(d(knee, foot), 'tibia ' + s).to.be.within(0.3, 0.7);
        expect(knee[1], 'genou sous la hanche ' + s).to.be.lessThan(hip[1]);
        expect(knee[1], 'genou au-dessus du pied ' + s).to.be.greaterThan(foot[1]);
      }
    });
  });
});
