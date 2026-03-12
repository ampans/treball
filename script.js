const personatges = [
  { imatge: "anna.png",     frase: "anna_frase.png",     correcta: 1 },
  { imatge: "oriol.png",    frase: "oriol_frase.png",     correcta: 2 },
  { imatge: "yassin.png",   frase: "yassin_frase.png",    correcta: 3 },
  { imatge: "mercedes.png", frase: "mercedes_frase.png",  correcta: 3 },
  { imatge: "jose.png",     frase: "jose_frase.png",      correcta: 2 },
  { imatge: "doris.png",    frase: "doris_frase.png",     correcta: 1 },
  { imatge: "mari.png",     frase: "mari_frase.png",      correcta: 2 },
  { imatge: "raul.png",     frase: "raul_frase.png",      correcta: 3 }
];

let personatgesJugats = new Set();
let personatgeActual = null;

// CONFIGURAR OPCIONS
function configurarOpcions(p, indexosExclosos = []) {
  const opcions = [
    document.getElementById('op1'),
    document.getElementById('op2'),
    document.getElementById('op3')
  ];
  const correctes = [
    document.getElementById('correcte1'),
    document.getElementById('correcte2'),
    document.getElementById('correcte3')
  ];
  const incorrectes = [
    document.getElementById('incorrecte1'),
    document.getElementById('incorrecte2'),
    document.getElementById('incorrecte3')
  ];

  // Resetar estat
  opcions.forEach((op, i) => op.style.opacity = indexosExclosos.includes(i) ? '0.3' : '1');
  correctes.forEach(c => c.classList.remove('visible'));
  incorrectes.forEach(i => i.classList.remove('visible'));
  document.getElementById('boto-seguent').classList.add('amagat');
  document.getElementById('boto-tornar').classList.add('amagat');

  opcions.forEach((op, index) => {
    if (indexosExclosos.includes(index)) return;
    op.onclick = () => {
      opcions.forEach(o => o.onclick = null);

      if (index + 1 === p.correcta) {
        opcions.forEach((altra, i) => {
          if (i !== index) altra.style.opacity = '0.3';
        });
        correctes[index].classList.add('visible');
        document.getElementById('boto-seguent').classList.remove('amagat');
      } else {
        opcions.forEach((altra, i) => {
          if (i !== index) altra.style.opacity = '0.3';
        });
        incorrectes[index].classList.add('visible');
        document.getElementById('boto-tornar').classList.remove('amagat');

        const nousExclosos = [...indexosExclosos, index];
        let timer = setTimeout(reset, 2000);

        function reset() {
          clearTimeout(timer);
          document.getElementById('boto-tornar').classList.add('amagat');
          configurarOpcions(p, nousExclosos);
          document.removeEventListener('click', reset);
        }

        setTimeout(() => document.addEventListener('click', reset), 50);
      }
    };
  });
}

// PANTALLA PERSONATGE
function mostrarPantallaPersonatge(p) {
  personatgeActual = p;
  personatgesJugats.add(p.imatge);

  document.getElementById('tauler').style.display = 'none';
  document.querySelector('h1').style.display = 'none';

  const nom = p.imatge.replace('.png', '');

  document.getElementById('imatge-frase').src = `Imatges/${p.frase}`;
  document.getElementById('op1').src = `Imatges/${nom}_op1.png`;
  document.getElementById('op2').src = `Imatges/${nom}_op2.png`;
  document.getElementById('op3').src = `Imatges/${nom}_op3.png`;

  document.getElementById('pantalla-personatge').classList.remove('amagat');

  configurarOpcions(p);
}

// CREAR TAULER
function iniciarJoc() {
  document.getElementById('pantalla-personatge').classList.add('amagat');
  document.getElementById('tauler').style.display = 'grid';
  document.querySelector('h1').style.display = 'block';

  const totsFets = personatgesJugats.size === personatges.length;

  if (totsFets) {
    document.querySelector('h1').textContent = 'Bona feina!';
    document.querySelector('h1').style.color = '#000000';
    let subtitol = document.getElementById('subtitol-final');
    if (!subtitol) {
      subtitol = document.createElement('p');
      subtitol.id = 'subtitol-final';
      subtitol.textContent = 'A AMPANS acompanyem a persones amb discapacitat intel·lectual i en risc d\'exclusió per fer realitat els seus projectes de vida';
      document.querySelector('h1').insertAdjacentElement('afterend', subtitol);
    }
    subtitol.style.display = 'block';
  } else {
    const subtitol = document.getElementById('subtitol-final');
    if (subtitol) subtitol.style.display = 'none';
    document.querySelector('h1').textContent = 'Escull una persona';
    document.querySelector('h1').style.color = '';
  }

  const tauler = document.getElementById('tauler');
  tauler.innerHTML = '';

  personatges.forEach((p, index) => {
    const targeta = document.createElement('div');
    targeta.classList.add('targeta');
    targeta.innerHTML = `<img src="Imatges/${p.imatge}" alt="${p.imatge}">`;

    if (personatgesJugats.has(p.imatge) && !totsFets) {
      targeta.classList.add('jugada');
    } else if (!totsFets) {
      targeta.addEventListener('click', () => mostrarPantallaPersonatge(p));
    }

    targeta.style.opacity = '0';
    targeta.style.transform = 'scale(0.5)';
    tauler.appendChild(targeta);

    setTimeout(() => {
      targeta.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      targeta.style.opacity = (!totsFets && personatgesJugats.has(p.imatge)) ? '0.3' : '1';
      targeta.style.transform = 'scale(1)';
    }, index * 150);
  });
}

// REINICIAR JOC (botó "Tornar a començar")
function reiniciarJoc() {
  personatgesJugats.clear();
  document.getElementById('boto-seguent').classList.add('amagat');
  document.getElementById('boto-tornar').classList.add('amagat');
  iniciarJoc();
}

// BOTÓ SEGÜENT
document.getElementById('boto-seguent').addEventListener('click', () => {
  document.getElementById('boto-seguent').classList.add('amagat');
  iniciarJoc();
});

// PANTALLA D'INICI
const pantallaInici = document.getElementById('pantallaStandby');

pantallaInici.addEventListener('click', () => {
  pantallaInici.classList.add('amagar');
  document.body.classList.remove('joc-no-iniciat');
  iniciarJoc();
  reiniciarTemporizador();
});

// TEMPORITZADOR D'INACTIVITAT (5 minuts)
let temporizadorInactivitat;
const TEMPS_INACTIVITAT = 300000;

function reiniciarTemporizador() {
  clearTimeout(temporizadorInactivitat);
  temporizadorInactivitat = setTimeout(tornarAInici, TEMPS_INACTIVITAT);
}

function tornarAInici() {
  personatgesJugats.clear();
  document.getElementById('pantallaStandby').classList.remove('amagar');
  document.body.classList.add('joc-no-iniciat');
  document.getElementById('pantalla-personatge').classList.add('amagat');
  document.getElementById('boto-seguent').classList.add('amagat');
  document.getElementById('boto-tornar').classList.add('amagat');
}

// Detectar activitat
document.addEventListener('click', reiniciarTemporizador);
document.addEventListener('touchstart', reiniciarTemporizador);
document.addEventListener('mousemove', reiniciarTemporizador);