/* Capture les états clés du rendu pour la revue visuelle
   (comparaison PS1 / visuels kitesurf). */

const steps = (w, n, dt = 0.05) => { for (let i = 0; i < n; i++) w.KITELINE.step(dt); };
const stepUntil = (w, cond, max = 200, dt = 0.05) => {
  for (let i = 0; i < max && !cond(); i++) w.KITELINE.step(dt);
};
const shot = name => cy.wait(250).get('#stage').screenshot(name, { overwrite: true });

describe('captures visuelles', () => {
  beforeEach(() => {
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
  });

  it('01 — écran titre', () => {
    shot('01-titre');
  });

  it('01b — vue de départ (bouée droit devant)', () => {
    cy.window().then(w => { w.KITELINE.begin(); w.KITELINE.step(0.05); });
    shot('01b-depart');
  });

  it('02 — navigation au travers', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.heading = 0;
      steps(w, 100);
    });
    shot('02-ride');
  });

  it('03 — gros saut au-dessus du récif', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.heading = 0; G.z = -150; G.x = 0; G.speed = 10;
      G.air = true; G.y = 7; G.vy = 4; G.airT = 0.8; G.kite = 75; G.roll = 200;
    });
    shot('03-air');
  });

  it("04 — aile tombée à l'eau", () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      w.KITELINE.kiteFall();
      steps(w, 30);
    });
    shot('04-aile-a-leau');
  });

  it('05 — chute du rider', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.air = true; G.y = 4; G.vy = -3; G.airT = 1; G.spin = 90;
      stepUntil(w, () => !G.air);       // on retombe…
      steps(w, 4, 0.016);               // …et on fige la chute en cours
    });
    shot('05-chute');
  });

  it('06 — le ponton et le spot', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = 45; G.z = 20; G.heading = Math.PI * 0.4; G.speed = 15;
      steps(w, 20);
    });
    shot('06-ponton');
  });

  it("07 — l'île aux palmiers", () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = 118; G.z = 150; G.heading = Math.PI / 2; G.speed = 10;
      steps(w, 2, 0.016);
    });
    shot('07-ile');
  });

  const grabShot = (name, keys) => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.heading = 0; G.speed = 14;
      G.air = true; G.y = 9; G.vy = 5; G.airT = 0.6; G.kite = 75;
      G.grabName = ''; G.grabsDone = [];
      w.KITELINE.setK('grab', 1);
      (keys || []).forEach(k => w.KITELINE.setK(k, 1));
      for (let i = 0; i < 30; i++) w.KITELINE.step(0.03);   // laisse la pose s'installer
    });
    cy.wait(150).get('#stage').screenshot(name, { overwrite: true });
    cy.window().then(w => { w.KITELINE.setK('grab', 0); (keys || []).forEach(k => w.KITELINE.setK(k, 0)); });
  };

  it('09 — grab Indy (toe, main arrière)', () => grabShot('09-grab-indy', []));
  it('09b — Tail Grab (tail relevé)', () => grabShot('09b-grab-tail', ['pass']));
  it('09c — Melon (heel, main avant)', () => grabShot('09c-grab-melon', ['kdown']));

  it('10 — déferlantes sur le banc de sable', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = -20; G.z = -140; G.heading = Math.PI / 2; G.speed = 14;   // longe le grand banc
      steps(w, 30);
    });
    shot('10-deferlantes');
  });

  it("11 — assis dans l'eau, face au vent", () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = 0; G.z = 0; G.heading = Math.PI * 1.5;
      steps(w, 180);
    });
    shot('11-assis');
  });

  it('12 — gerbe latérale en carving', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = -40; G.z = 20; G.heading = 0; G.speed = 15; G.load = 1.2;
      w.KITELINE.setK('edge', 1);
      steps(w, 24);
    });
    shot('12-gerbe');
    cy.window().then(w => w.KITELINE.setK('edge', 0));
  });

  it('13 — au large, loin de la carte (open water infini)', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = 900; G.z = -600; G.heading = 0; G.speed = 16;
      steps(w, 20);
    });
    shot('13-large');
  });

  it('14 — aile basse (bank : boudin sur le côté)', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = -40; G.z = 20; G.heading = 0; G.speed = 14; G.kite = 22;
      steps(w, 6, 0.016);
    });
    shot('14-aile-basse');
  });

  it('16 — grab en gros plan (main sur la planche)', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.heading = 0; G.speed = 14; G.air = true; G.y = 18; G.vy = 1; G.airT = 0.6; G.kite = 90;
      G.grabName = ''; G.grabsDone = [];
      w.KITELINE.setK('grab', 1); w.KITELINE.setK('kdown', 1);   // Melon
      for (let i = 0; i < 16; i++) w.KITELINE.step(0.02);        // reste en l'air
      w.KITELINE.photo = true;
    });
    cy.wait(300).get('#stage').screenshot('16-grab-photo', { overwrite: true });
    cy.window().then(w => { w.KITELINE.photo = false; w.KITELINE.setK('grab', 0); w.KITELINE.setK('kdown', 0); });
  });

  it('15 — rider en gros plan (mode photo)', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = -40; G.z = 20; G.heading = 0; G.speed = 16; G.load = 0.6; G.kite = 60;
      w.KITELINE.setK('edge', 1);
      steps(w, 30);
      w.KITELINE.photo = true;
    });
    cy.wait(300).get('#stage').screenshot('15-rider', { overwrite: true });
    cy.window().then(w => { w.KITELINE.photo = false; w.KITELINE.setK('edge', 0); });
  });

  it("17 — l'épave (galion de pirate échoué)", () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.x = 108; G.z = 138; G.speed = 6;
      G.heading = Math.atan2(90 - G.x, 120 - G.z);   // vise l'épave de pirate (90,120)
      steps(w, 2, 0.016);
    });
    shot('17-epave');
  });

  it('18 — layout mobile (pad compact, jeu plus grand)', () => {
    cy.viewport(390, 844);   // iPhone portrait
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
    cy.window().then(w => { w.KITELINE.begin(); const G = w.KITELINE.G; G.heading = 0; steps(w, 40); });
    cy.wait(200).screenshot('18-mobile', { overwrite: true, capture: 'viewport' });
  });

  it('19 — layout paysage mobile (contrôles à gauche/droite)', () => {
    cy.viewport(844, 390);   // iPhone paysage
    cy.visit('/kiteline-3d.html');
    cy.window().its('KITELINE').should('exist');
    cy.window().then(w => { w.KITELINE.begin(); const G = w.KITELINE.G; G.heading = 0; steps(w, 40); });
    cy.get('#dpad').should('be.visible');
    cy.get('#acts').should('be.visible');
    cy.wait(200).screenshot('19-mobile-paysage', { overwrite: true, capture: 'viewport' });
  });

  it('08 — écran de fin', () => {
    cy.window().then(w => {
      w.KITELINE.begin();
      const G = w.KITELINE.G;
      G.score = 52350; G.best = 18400;
      G.goals.score = 1; G.goals.pier = 1;
      G.time = 0.05;
      steps(w, 3);
    });
    shot('08-fin');
  });
});
