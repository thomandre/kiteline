/* Vérifie que chaque touche clavier et chaque bouton tactile
   pilote bien l'action annoncée dans le HUD. */

/* codes physiques : KeyA/S/D/F = touches Q S D F sur un clavier AZERTY */
const EXPECTED_MAP = {
  ArrowLeft: 'left', ArrowRight: 'right',
  ArrowUp: 'kup', ArrowDown: 'kdown',
  KeyA: 'spin', KeyS: 'roll', KeyD: 'grab', KeyF: 'pass',
  KeyJ: 'spin', KeyK: 'roll', KeyL: 'grab', KeyM: 'pass',
  Space: 'edge',
  ShiftLeft: 'loop', ShiftRight: 'loop'
};

describe('mapping des contrôles', () => {
  beforeEach(() => {
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
  });

  it('expose exactement le mapping annoncé', () => {
    cy.window().then(w => {
      expect(w.KITELINE.MAP).to.deep.equal(EXPECTED_MAP);
    });
  });

  it('chaque touche du clavier active puis relâche la bonne action', () => {
    cy.window().then(w => {
      const { KEYS } = w.KITELINE;
      for (const [code, key] of Object.entries(EXPECTED_MAP)) {
        w.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
        expect(KEYS[key], `${code} enfoncée → ${key}=1`).to.eq(1);
        w.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
        expect(KEYS[key], `${code} relâchée → ${key}=0`).to.eq(0);
      }
    });
  });

  it('le jeu démarre via le bouton START, pas au clavier ni au clic sur le voile', () => {
    cy.get('#veilText').should('exist');          // le texte est dans une zone scrollable
    cy.get('#startBtn').should('be.visible');
    cy.window().then(w => {
      expect(w.KITELINE.G.phase).to.eq('title');
      w.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(w.KITELINE.G.phase, 'une touche ne démarre pas').to.eq('title');
      w.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
    });
    cy.get('#veil').should('be.visible');
    cy.get('#startBtn').click();
    cy.window().then(w => expect(w.KITELINE.G.phase).to.eq('run'));
    cy.get('#veil').should('not.be.visible');
  });

  it('R relance une partie neuve', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      w.KITELINE.G.score = 12345;
      w.KITELINE.G.x = 50;
      w.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }));
      expect(w.KITELINE.G.score).to.eq(0);
      expect(w.KITELINE.G.phase).to.eq('run');
    });
  });

  it('chaque bouton tactile active puis relâche la bonne action', () => {
    cy.viewport(420, 900); // sous 760px le pad tactile est affiché
    cy.window().then(w => w.KITELINE.begin());
    cy.get('#pad [data-k]').should('be.visible');
    cy.get('#pad [data-k]').each($b => {
      const k = $b.data('k');
      cy.wrap($b).trigger('pointerdown', { pointerId: 1, force: true });
      cy.window().then(w => expect(w.KITELINE.KEYS[k], `bouton ${k} enfoncé`).to.eq(1));
      cy.wrap($b).trigger('pointerup', { pointerId: 1, force: true });
      cy.window().then(w => expect(w.KITELINE.KEYS[k], `bouton ${k} relâché`).to.eq(0));
    });
  });
});
