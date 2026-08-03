/* Teste le noyau physique via l'API exposée : vitesse, saut,
   chute du rider, aile à l'eau et redécollage. */

const steps = (w, n, dt = 0.05) => { for (let i = 0; i < n; i++) w.KITELINE.step(dt); };
const stepUntil = (w, cond, max = 200, dt = 0.05) => {
  for (let i = 0; i < max && !cond(); i++) w.KITELINE.step(dt);
};

describe('gameplay', () => {
  beforeEach(() => {
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
    cy.window().then(w => w.KITELINE.begin());
  });

  it('rapide au travers ET au vent arrière, lent face au vent', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.heading = 0;                // plein travers (vent vers +X, cap vers +Z)
      steps(w, 120);
      expect(G.speed, 'au travers').to.be.greaterThan(14);
      G.heading = Math.PI / 2;      // plein vent arrière : le downwinder marche
      steps(w, 120);
      expect(G.speed, 'au vent arrière').to.be.greaterThan(13);
      G.heading = Math.PI * 1.5;    // plein vent debout
      steps(w, 160);
      expect(G.speed, 'face au vent').to.be.lessThan(6);
    });
  });

  it('▶ vire à droite écran, ◀ à gauche (caméra de chasse)', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      // cap 0 = face à +Z, caméra derrière : la droite écran est -X
      G.heading = 0;
      w.KITELINE.setK('right', 1);
      steps(w, 10);
      w.KITELINE.setK('right', 0);
      expect(Math.sin(G.heading), '▶ → dérive vers -X').to.be.lessThan(0);
      G.heading = 0;
      w.KITELINE.setK('left', 1);
      steps(w, 10);
      w.KITELINE.setK('left', 0);
      expect(Math.sin(G.heading), '◀ → dérive vers +X').to.be.greaterThan(0);
    });
  });

  it('carre chargé + relâché = décollage', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.heading = 0; G.speed = 20;
      w.KITELINE.setK('edge', 1);
      steps(w, 30);
      expect(G.load, 'lignes chargées').to.be.greaterThan(0.12);
      w.KITELINE.setK('edge', 0);
      steps(w, 2);
      expect(G.air, 'décollé').to.eq(true);
      expect(G.vy).to.be.greaterThan(0);
    });
  });

  it('rotation non terminée = chute du rider avec éclaboussures', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.air = true; G.y = 5; G.vy = -2; G.airT = 1; G.spin = 90; G.kite = 60;
      stepUntil(w, () => !G.air);
      expect(G.air, 'retombé').to.eq(false);
      expect(G.crashT, 'en train de tomber').to.be.greaterThan(0);
      expect(G.banner).to.contain('CHUTE');
      expect(G.pot, 'combo perdu').to.eq(0);
    });
  });

  it("un spin complet réceptionné remet le rider dans l'axe", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.air = true; G.y = 5; G.vy = -2; G.airT = 1; G.spin = 355; G.kite = 60;
      stepUntil(w, () => !G.air);
      expect(G.crashT, 'réception plaquée').to.be.at.most(0);
      expect(G.spin, 'rotation remise à zéro').to.eq(0);
      expect(G.trick).to.contain('360');
    });
  });

  it("caler face au vent = s'asseoir dans l'eau, pas de wipeout", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.x = 0; G.z = 0; G.air = false;
      G.heading = Math.PI * 1.5;   // plein vent debout : eff ~ 0
      steps(w, 200);
      expect(G.sat, 'assis').to.be.greaterThan(0);
      expect(G.crashT, 'pas de wipeout dur').to.be.at.most(0);
      expect(G.banner).to.contain('FACE AU VENT');
    });
  });

  it("sans rien faire, on reste assis ; piquer l'aile (▼) fait redémarrer", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.x = 0; G.z = 0; G.air = false; G.heading = Math.PI * 1.5;
      steps(w, 200);
      expect(G.sat, 'assis, ne repart pas tout seul').to.be.greaterThan(0);
      const before = G.speed;
      // abattre pour retrouver du rendement, puis piquer l'aile
      G.heading = 0;
      w.KITELINE.setK('kdown', 1);
      steps(w, 40);
      w.KITELINE.setK('kdown', 0);
      expect(G.sat, 'ressorti de l\'eau').to.eq(0);
      expect(G.speed, 'de la vitesse reprise').to.be.greaterThan(before + 3);
    });
  });

  it("labourer l'eau blanche = chute sur le banc de sable", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.x = 0; G.z = -160; G.air = false;   // crête du grand banc extérieur
      steps(w, 3);
      expect(G.crashT, 'banc de sable').to.be.greaterThan(0);
      expect(G.banner).to.contain('BANC');
    });
  });

  it("le saut est meilleur l'aile au zénith", () => {
    cy.window().then(w => {
      const K = w.KITELINE;
      K.G = Object.assign(K.newState(), { phase: 'run', heading: 0, speed: 20, load: 1, kite: 90, wasEdge: true });
      K.step(0.02);   // relâché du carre, aile au zénith
      expect(K.G.air, 'décollé au zénith').to.eq(true);
      const vyZenith = K.G.vy;
      K.G = Object.assign(K.newState(), { phase: 'run', heading: 0, speed: 20, load: 1, kite: 20, wasEdge: true });
      K.step(0.02);   // même pop, aile écrasée en bord de fenêtre
      expect(vyZenith, 'le zénith envoie plus haut').to.be.greaterThan(K.G.vy * 1.5);
    });
  });

  it("garder l'aile au zénith en vol = hangtime, sauts plus longs", () => {
    cy.window().then(w => {
      const K = w.KITELINE;
      const fly = kite => {
        K.G = Object.assign(K.newState(), { phase: 'run', heading: 0, speed: 20 });
        const G = K.G;
        G.air = true; G.y = 6; G.vy = 10; G.airT = 0;
        let n = 0;
        while (G.air && n < 400) { G.kite = kite; K.step(0.02); n++; }
        return G.maxAir;
      };
      const zenith = fly(90);   // aile gardée au zénith : l'aile te suspend
      const basse = fly(45);    // aile en bord de fenêtre : chute libre
      expect(zenith, 'hangtime au zénith').to.be.greaterThan(basse * 1.3);
    });
  });

  it("toucher la terre = wipeout appuyé, puis redémarrage en eau navigable de l'autre côté", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.x = 170; G.z = 150; G.air = false; G.heading = 0;   // en plein sur l'île, cap +z
      steps(w, 3);
      expect(G.crashT, 'wipeout en cours').to.be.greaterThan(1.5);   // anim longue = on perd du temps
      expect(G.banner).to.contain('ENSABL');
      expect(G.pot, 'combo perdu').to.eq(0);
      const cx = G.x, cz = G.z;
      steps(w, 60);                                          // on attend la fin de l'animation
      expect(G.crashT, 'wipeout terminé').to.be.at.most(0);
      expect(w.KITELINE.staticH(G.x, G.z), 'de retour en eau navigable').to.be.lessThan(2.6);
      expect(Math.hypot(G.x - cx, G.z - cz), "déplacé de l'autre côté").to.be.greaterThan(10);
    });
  });

  it("l'aile plantée en bord de fenêtre tombe à l'eau", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      w.KITELINE.setK('kdown', 1);
      steps(w, 60); // 3 s aile écrasée en bas de fenêtre
      w.KITELINE.setK('kdown', 0);
      expect(G.kiteWet, "aile à l'eau").to.eq(true);
      expect(G.banner).to.contain('AILE');
      expect(G.power).to.eq(0);
      steps(w, 60);
      expect(G.speed, "plus de traction").to.be.lessThan(2);
    });
  });

  it("maintenir ▲ relance l'aile tombée", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      w.KITELINE.kiteFall();
      expect(G.kiteWet).to.eq(true);
      w.KITELINE.setK('kup', 1);
      stepUntil(w, () => !G.kiteWet, 60); // il faut 1,6 s de ▲ maintenu
      w.KITELINE.setK('kup', 0);
      expect(G.kiteWet, 'aile relancée').to.eq(false);
      expect(G.kite, 'aile de retour dans la fenêtre').to.be.within(25, 90);
    });
  });

  it("réception aile trop basse : le rider ET l'aile tombent", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.air = true; G.y = 5; G.vy = -2; G.airT = 1; G.kite = 18;
      stepUntil(w, () => !G.air);
      expect(G.air).to.eq(false);
      expect(G.crashT, 'rider tombé').to.be.greaterThan(0);
      expect(G.kiteWet, "aile à l'eau aussi").to.eq(true);
    });
  });

  it("le hang time s'affiche à partir de 2 s de vol", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.air = true; G.y = 60; G.vy = 8; G.airT = 2.3; G.kite = 90;
    });
    cy.get('#hAir').should('contain', ' s');
    cy.window().then(w => { const G = w.KITELINE.G; G.air = false; G.y = 0; G.vy = 0; G.airT = 0; });
  });

  it("l'aile est instable au sol : elle dérive toute seule", () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.x = 0; G.z = 0; G.air = false; G.heading = 0; G.speed = 12; G.kite = 58;
      let min = 999, max = -999;
      for (let i = 0; i < 130; i++) { w.KITELINE.step(0.05); min = Math.min(min, G.kite); max = Math.max(max, G.kite); }
      expect(max - min, "amplitude de dérive de l'aile").to.be.greaterThan(4);
    });
  });

  it('grab + direction choisit la prise (prévisible, plus de tirage au sort)', () => {
    cy.window().then(w => {
      const K = w.KITELINE, G = K.G;
      const grabWith = dir => {
        G.air = true; G.y = 8; G.vy = 4; G.airT = 0.5; G.kite = 75; G.grabName = 'Indy';
        ['kup', 'kdown', 'left', 'right', 'pass'].forEach(k => K.setK(k, 0));
        K.setK('grab', 1); if (dir) K.setK(dir, 1);
        K.step(0.05);
        const n = G.grabName;
        K.setK('grab', 0); if (dir) K.setK(dir, 0);
        return n;
      };
      expect(grabWith(null)).to.eq('Indy');
      expect(grabWith('kdown')).to.eq('Melon');
      expect(grabWith('kup')).to.eq('Stalefish');
      expect(grabWith('left')).to.eq('Nuclear');
      expect(grabWith('right')).to.eq('Slob');
    });
  });

  it('on peut enchaîner plusieurs grabs dans le même saut', () => {
    cy.window().then(w => {
      const K = w.KITELINE, G = K.G;
      G.heading = 0; G.air = true; G.y = 12; G.vy = 6; G.airT = 0.4; G.kite = 75;
      G.grabName = ''; G.grabsDone = [];
      K.setK('grab', 1); K.setK('kdown', 1);          // Melon
      for (let i = 0; i < 8; i++) K.step(0.05);
      K.setK('kdown', 0); K.setK('kup', 1);           // → Stalefish
      for (let i = 0; i < 8; i++) K.step(0.05);
      K.setK('kup', 0); K.setK('left', 1);            // → Nuclear
      for (let i = 0; i < 8; i++) K.step(0.05);
      const names = G.grabsDone.map(g => g.name);
      expect(names).to.include('Melon');
      expect(names).to.include('Stalefish');
      expect(G.grabsDone.length, 'plusieurs grabs enchaînés').to.be.greaterThan(1);
      ['grab', 'left', 'kup', 'kdown'].forEach(k => K.setK(k, 0));
    });
  });

  it('un gros saut est étiqueté BIG AIR', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.heading = 0; G.air = true; G.y = 0.1; G.vy = -2; G.airT = 2.4; G.maxH = 9; G.kite = 75;
      w.KITELINE.step(0.05);
      expect(G.air, 'a réceptionné').to.eq(false);
      expect(G.trick.toUpperCase()).to.contain('BIG AIR');
    });
  });

  it('le chrono termine la partie', () => {
    cy.window().then(w => {
      const G = w.KITELINE.G;
      G.time = 0.05;
      steps(w, 3);
      expect(G.phase).to.eq('over');
    });
    cy.get('#veil').should('be.visible').and('contain', 'FIN DE RUN');
  });
});
