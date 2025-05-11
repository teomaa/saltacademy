$(function() {
  // Install Paper.js and set up full-window canvas
  paper.install(window);
  const canvas = document.getElementById('gameCanvas');
  let currentBg = null;

  // State variables
  let desiredItemWidth, startX, startY, spacing;
  let faucetRegion, stoveRegion, boardRegion, bowlRegion;
  let dropTarget, stoveTarget, boardTarget, bowlTarget;
  let background;

  // Draggables
  let potEmpty, potFull, saltShaker;
  let potatoRaster, cucumberRaster, tomatoRaster, knifeRaster, slicedRaster;

  // Game state flags
  let potOnStove = false;
  let potatoAdded = false;
  let boardOccupied = false;
  let boardVeggie = null;
  let boardVeggieSliced = false;
  let bowlState = 'empty'; // 'empty', veggie, 'full'
  let potSalted     = false,
    bowlSalted    = false,
    congratsShown = false;

  // Salt counts
  let handfulCount = 0, pinchCount = 0;
  let originalSaltPos;

  // Original positions
  let potatoOriginalPos, cucumberOriginalPos, tomatoOriginalPos, knifeOriginalPos;

  // Resize and redraw targets
  function resizeCanvas() {
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    paper.view.viewSize = new Size(w, h);
    computeGeometry();
    [dropTarget, stoveTarget, boardTarget, bowlTarget].forEach(t => t && t.remove());
    drawDropTarget();
    drawStoveTarget();
    drawBoardTarget();
    drawBowlTarget();
  }
  window.addEventListener('resize', resizeCanvas);

  // Initialize Paper.js
  paper.setup(canvas);
  resizeCanvas();

    // two columns for draggables
  const col1X = startX;
  const hGap  = desiredItemWidth * 1;
  const col2X = startX + hGap;
  const rowSpacing = spacing * 1;


  // Compute layout
  function computeGeometry() {
    const vb = view.bounds;
    desiredItemWidth = vb.width * 0.1;
    startX = vb.left + vb.width * 0.05;  // 5% from left
    startY = vb.top + vb.height * 0.2;
    spacing = vb.height * 0.15;
    faucetRegion = new Rectangle(
      vb.center.add(new Point(-vb.height * 0.1 - vb.width * 0.1, -vb.height * 0.4)),
      new Size(vb.width * 0.23, vb.height * 0.32)
    );
    stoveRegion = new Rectangle(
      vb.center.add(new Point(vb.height * 0.5 - vb.width * 0.1, -vb.height * 0.4)),
      new Size(vb.width * 0.22, vb.height * 0.32)
    );
    boardRegion = new Rectangle(
      vb.center.add(new Point(-vb.height * 0.38 - vb.width * 0.1, -vb.height * 0.23)),
      new Size(vb.width * 0.14, vb.height * 0.2)
    );
    bowlRegion = new Rectangle(
      vb.center.add(new Point(vb.height * 0.28 - vb.width * 0.064, -vb.height * 0.23)),
      new Size(vb.width * 0.075, vb.height * 0.15)
    );
  }

  // Draw targets
  function drawDropTarget() {
    dropTarget = new Path.Rectangle({ rectangle: faucetRegion, strokeColor: 'blue', strokeWidth: 2, dashArray: [10, 10] });
    dropTarget.sendToBack();
  }
  function drawStoveTarget() {
    stoveTarget = new Path.Rectangle({ rectangle: stoveRegion, strokeColor: 'blue', strokeWidth: 2, dashArray: [10, 10] });
    stoveTarget.sendToBack();
  }
  function drawBoardTarget() {
    boardTarget = new Path.Rectangle({ rectangle: boardRegion, strokeColor: 'blue', strokeWidth: 2, dashArray: [5, 5] });
    boardTarget.sendToBack();
  }
  function drawBowlTarget() {
    bowlTarget = new Path.Rectangle({ rectangle: bowlRegion, strokeColor: 'blue', strokeWidth: 2, dashArray: [5, 5] });
    bowlTarget.sendToBack();
  }

  // Initial draw
  project.activeLayer.removeChildren();
  computeGeometry();
  drawDropTarget();
  drawStoveTarget();
  drawBoardTarget();
  drawBowlTarget();

  // Cutting board graphic
  new Raster({ source: 'static/images/cutting_board.png', onLoad: function() {
    const s = boardRegion.width / this.width;
    this.scale(s);
    this.position = boardRegion.center;
    this.insertAbove(background);
  }});

  // Bowl graphic initial
  let bowlRaster = new Raster({ source: 'static/images/bowl.png', onLoad: function() {
    const s = bowlRegion.width / this.width;
    this.scale(s);
    this.position = bowlRegion.center;
    this.insertAbove(background);
  }});

  // Background swap helper
  const bgWidthFrac = 0.7, bgMarginLeftFrac = 0.2;
  function swapBackground() {
    if (background) background.remove();
    currentBg = currentBg === 'kitchen_bg.png' ? 'kitchen_bg_2.png' : 'kitchen_bg.png';
    background = new Raster({ source: `static/images/${currentBg}`, onLoad: function() {
      const vb = view.bounds;
      const targetW = vb.width * bgWidthFrac;
      const sc = targetW / this.width;
      this.scale(sc);
      this.position = new Point(vb.left + vb.width * bgMarginLeftFrac + targetW / 2, vb.center.y);
      this.sendToBack();
    }});
  }
  swapBackground();

  // Fill pot logic
  function startFilling() {
    swapBackground();
    const pos = potEmpty.position.clone();
    potEmpty.remove();
    potFull = new Raster({ source: 'static/images/pot_full.png', onLoad: function() {
      let s = (desiredItemWidth / this.width) * 1.5;
      this.scale(s);
      this.position = pos;
      this.bringToFront();
      this.onMouseDrag = function(e) { this.position = this.position.add(e.delta); };
      this.onMouseUp = function() {
        if (!potOnStove && this.bounds.intersects(stoveRegion)) {
          potOnStove = true;
          stoveTarget.strokeColor = 'green';
          swapBackground();
        }
      };
    }});
  }

  // Prompt for pot salt
  function promptPotSalt() {
    handfulCount = pinchCount = 0;
    const pt = stoveRegion.topLeft;
    const modal = $('<div>').css({
      position: 'absolute',
      top: pt.y + 'px',
      left: (pt.x - 320) + 'px',
      width: '300px', background: '#fff', padding: '20px', borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 9999, textAlign: 'center'
    });
    modal.append('<p>How much salt for the pot?</p>');
    const btnH = $('<button>+1 handful</button>').css({ margin: '5px' });
    const btnP = $('<button>+1 pinch</button>').css({ margin: '5px' });
    const btnD = $('<button>Done</button>').css({ margin: '5px' });
    modal.append(btnH, btnP, btnD);
    $('body').append(modal);
    btnH.on('click', () => handfulCount++);
    btnP.on('click', () => pinchCount++);
    btnD.on('click', () => {
  btnH.remove(); btnP.remove(); btnD.remove();
  // now using the old bowl rule for the pot:
  // 1 handful + 0–10 pinches, OR 2 handfuls + 0 pinches
  const correctPot =
    (handfulCount === 1 && pinchCount >= 0 && pinchCount <= 10) ||
    (handfulCount === 2 && pinchCount === 0);

  let text;
  if (correctPot) {
    text = 'Correct!';
  } else if (handfulCount < 1) {
    text = "That's too little--try a bit more!";
  } else if (handfulCount > 2) {
    text = "That's a bit too much--try a bit less!";
  } else if (handfulCount === 1 && pinchCount > 10) {
    text = "That's a bit too much--try a bit less!";
  } else if (handfulCount === 2 && pinchCount > 0) {
    text = "That's a bit too much--try a bit less!";
  } else {
    text = 'Wrong amount.';
  }

  modal.append(
    $('<p>').text(text).css({ marginTop: '10px' })
  );
  if (saltShaker && originalSaltPos) {
    saltShaker.position = originalSaltPos.clone();
    saltShaker.bringToFront();
  }

setTimeout(() => {
  modal.remove();
  if (correctPot)    potSalted = true;
  if (potSalted && bowlSalted && potatoAdded && !congratsShown) {
    congratsShown = true;
    showCongrats();
  }
}, 2000);

});
  }

  // Prompt for bowl salt
  function promptBowlSalt() {
    handfulCount = pinchCount = 0;
    const pt = bowlRegion.topLeft;
    const modal = $('<div>').css({
      position: 'absolute',
      top: pt.y + 'px',
      left: (pt.x - 320) + 'px',
      width: '300px', background: '#fff', padding: '20px', borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 9999, textAlign: 'center'
    });
    modal.append('<p>How much salt for the bowl?</p>');
    const btnH2 = $('<button>+1 handful</button>').css({ margin: '5px' });
    const btnP2 = $('<button>+1 pinch</button>').css({ margin: '5px' });
    const btnD2 = $('<button>Done</button>').css({ margin: '5px' });
    modal.append(btnH2, btnP2, btnD2);
    $('body').append(modal);
    btnH2.on('click', () => handfulCount++);
    btnP2.on('click', () => pinchCount++);
    btnD2.on('click', () => {
  btnH2.remove(); btnP2.remove(); btnD2.remove();
  // now using the old pot rule for the bowl:
  // exactly 3–5 pinches, no handfuls
  const correctBowl = handfulCount === 0 && pinchCount >= 3 && pinchCount <= 5;

  let text;
  if (correctBowl) {
    text = 'Correct!';
  } else if (handfulCount > 0) {
    text = "That's a bit too much--try a bit less!";
  } else if (pinchCount < 3) {
    text = "That's too little--try a bit more!";
  } else if (pinchCount > 5) {
    text = "That's a bit too much--try a bit less!";
  } else {
    text = 'Wrong amount.';
  }

  modal.append(
    $('<p>').text(text).css({ marginTop: '10px' })
  );
  if (saltShaker && originalSaltPos) {
    saltShaker.position = originalSaltPos.clone();
    saltShaker.bringToFront();
  }
  // inside promptBowlSalt(), replace the setTimeout with:

setTimeout(() => {
  modal.remove();
  if (correctBowl)  bowlSalted = true;
  if (potSalted && bowlSalted && potatoAdded && !congratsShown) {
    congratsShown = true;
    showCongrats();
  }
}, 2000);

});
  }

  // Helper to load items
  function loadItem(src, x, y, toFaucet = false, onAfterLoad = null) {
    const r = new Raster({ source: src, onLoad: function() {
      const sc = desiredItemWidth / this.width; this.scale(sc);
      this.position = new Point(x, y);
      this.bringToFront();
      this.onMouseDrag = function(e) { this.position = this.position.add(e.delta); };
      if (toFaucet) {
        this.onMouseUp = function() { if (this.bounds.intersects(faucetRegion)) startFilling(); };
      }
      if (onAfterLoad) onAfterLoad(this);
    }});
    return r;
  }

  // Instantiate draggables
  function onPotLoad(item) {
    // keep your 1.5× scale
    item.scale(1.5);

    // store its “home” spot
    potOriginalPos = item.position.clone();

    // override the faucet‐drop handler so it snaps back when you miss
    item.onMouseUp = function() {
      if (this.bounds.intersects(faucetRegion)) {
        startFilling();
      } else {
        this.position = potOriginalPos.clone();
      }
    };
  }

  function onPotatoLoad(item) {
    item.scale(0.75);
    potatoOriginalPos = item.position.clone();
    item.onMouseUp = function() {
      if (potOnStove && potFull && !potatoAdded && this.bounds.intersects(potFull.bounds)) {
        const p = potFull.position.clone(); potFull.remove();
        potFull = new Raster({ source: 'static/images/pot_potato.png', onLoad: function() {
          let fs = desiredItemWidth / this.width; fs *= 1.5; this.scale(fs);
          this.position = p; this.bringToFront();
        }});
        potatoAdded = true;
        this.remove();
        if (potSalted && bowlSalted && !congratsShown) {
  congratsShown = true;
  setTimeout(showCongrats, 2000);
}
      } else {
        this.position = potatoOriginalPos.clone();
      }
    };
  }

  function onCucumberLoad(item) {
    item.scale(0.75);
    cucumberOriginalPos = item.position.clone();
    item.onMouseDown = function() {
      if (boardOccupied && this.bounds.intersects(boardRegion)) {
        boardOccupied = false;
        boardVeggie = null;
        boardVeggieSliced = false;
        drawBoardTarget();
      }
    };
    item.onMouseUp = function() {
      if (!boardOccupied && this.bounds.intersects(boardRegion)) {
        boardOccupied = true;
        boardVeggie = 'cucumber';
        boardVeggieSliced = false;
        drawBoardTarget();
        this.position = boardRegion.center.clone();
      } else {
        this.position = cucumberOriginalPos.clone();
      }
    };
  }

  function onTomatoLoad(item)  {
    item.scale(0.5);
    tomatoOriginalPos = item.position.clone();
    item.onMouseDown = function() {
      if (boardOccupied && this.bounds.intersects(boardRegion)) {
        boardOccupied = false;
        boardVeggie = null;
        boardVeggieSliced = false;
        drawBoardTarget();
      }
    };
    item.onMouseUp = function() {
      if (!boardOccupied && this.bounds.intersects(boardRegion)) {
        boardOccupied = true;
        boardVeggie = 'tomato';
        boardVeggieSliced = false;
        drawBoardTarget();
        this.position = boardRegion.center.clone();
      } else {
        this.position = tomatoOriginalPos.clone();
      }
    };
  }

  function onSaltShakerLoad(item)  {
    item.scale(0.5);
    originalSaltPos = item.position.clone();
    item.onMouseUp = function() {
      if (potOnStove && this.bounds.intersects(stoveRegion)) {
        promptPotSalt();
      } else if (bowlState === 'full' && this.bounds.intersects(bowlRegion)) {
        promptBowlSalt();
      } else {
        this.position = originalSaltPos.clone();
      }
    };
  }

  function onKnifeLoad(item)  {
    item.scale(1.5);
    knifeOriginalPos = item.position.clone();
    item.onMouseUp = function() {
      if (boardOccupied && boardVeggie && !boardVeggieSliced && this.bounds.intersects(boardRegion)) {
        if (boardVeggie === 'cucumber') cucumberRaster.remove();
        if (boardVeggie === 'tomato') tomatoRaster.remove();
        slicedRaster = new Raster({ source: `static/images/${boardVeggie}_sliced.png`, onLoad: function() {
          const ss = desiredItemWidth / this.width;
          this.scale(ss);
          this.position = boardRegion.center.clone();
          this.bringToFront();
          this.onMouseDrag = function(e) { this.position = this.position.add(e.delta); };
          this.onMouseUp = function() {
            if (this.bounds.intersects(bowlRegion)) {
              if (bowlState === 'empty') {
                bowlRaster.remove();
                bowlRaster = new Raster({ source: `static/images/bowl_${boardVeggie}.png`, onLoad: function() {
                  const bs = bowlRegion.width / this.width;
                  this.scale(bs);
                  this.position = bowlRegion.center;
                  this.insertAbove(background);
                }});
                bowlState = boardVeggie;
              } else if (bowlState !== 'full') {
                bowlRaster.remove();
                bowlRaster = new Raster({ source: 'static/images/bowl_full.png', onLoad: function() {
                  const bs = bowlRegion.width / this.width;
                  this.scale(bs);
                  this.position = bowlRegion.center;
                  this.insertAbove(background);
                }});
                bowlState = 'full';
              }
              this.remove();
              boardOccupied = false;
              boardVeggie = null;
              boardVeggieSliced = false;
              drawBoardTarget();
            } else {
              this.position = boardRegion.center.clone();
            }
          };
        }});
        boardVeggieSliced = true;
      }
      this.position = knifeOriginalPos.clone();
      this.bringToFront();
    };
  }
// row 1: only the pot
potEmpty = loadItem(
  'static/images/pot_empty.png',
  col1X+(hGap*0.55), startY,
  true,
  onPotLoad
);

// row 2: potato (col1), cucumber (col2)
potatoRaster = loadItem(
  'static/images/potato.png',
  col1X, startY + rowSpacing,
  false,
  onPotatoLoad
);
cucumberRaster = loadItem(
  'static/images/cucumber.png',
  col2X, startY + rowSpacing,
  false,
  onCucumberLoad
);

// row 3: tomato (col1), salt (col2)
tomatoRaster = loadItem(
  'static/images/tomato.png',
  col1X, startY + rowSpacing * 2,
  false,
  onTomatoLoad
);
saltShaker = loadItem(
  'static/images/salt_shaker.png',
  col2X, startY + rowSpacing * 2,
  false,
  onSaltShakerLoad
);

// row 4: just the knife (col1)
knifeRaster = loadItem(
  'static/images/knife.png',
  col1X + (hGap*0.55), startY + rowSpacing * 3,
  false,
  onKnifeLoad
);




  // potEmpty = loadItem('static/images/pot_empty.png', startX, startY, true, function(item) { item.scale(1.5); });
  // potatoRaster = loadItem('static/images/potato.png', startX, startY + spacing, false, function(item) );
  // cucumberRaster = loadItem('static/images/cucumber.png', startX, startY + spacing * 2, false, function(item) );
  //
  // saltShaker = loadItem('static/images/salt_shaker.png', startX, startY + spacing * 4, false, function(item));
  // knifeRaster = loadItem('static/images/knife.png', startX, startY + spacing * 5, false, function(item));

  function showCongrats() {
  // 1) clear everything
  project.activeLayer.removeChildren();

  // 2) draw the text
  const txt = new PointText({
    point: view.bounds.topCenter.add(new Point(0, 50)),
    content: 'Congratulations — You made two amazing dishes!',
    justification: 'center',
    fontSize: 30,
    fillColor: 'black'
  });

  // 3) load both images at 3× scale, then position them
  let bLoaded = false, pLoaded = false;
  let bowlFinal, potFinal;
  const gap = 50;

  bowlFinal = new Raster({
    source: 'static/images/bowl_full.png',
    onLoad() {
      this.scale(0.75);
      bLoaded = true;
      positionBoth();
    }
  });

  potFinal = new Raster({
    source: 'static/images/pot_potato.png',
    onLoad() {
      this.scale(0.75);
      pLoaded = true;
      positionBoth();
    }
  });

  function positionBoth() {
    if (!bLoaded || !pLoaded) return;
    const totalW = bowlFinal.bounds.width + potFinal.bounds.width + gap;
    const startX = view.center.x - totalW/2;
    const y      = view.center.y;
    bowlFinal.position = new Point(
      startX + bowlFinal.bounds.width/2, y
    );
    potFinal.position = new Point(
      startX + bowlFinal.bounds.width + gap + potFinal.bounds.width/2, y
    );
    // ensure text is on top
    txt.bringToFront();
  }
}


});
