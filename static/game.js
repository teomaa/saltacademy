$(function() {
  // Install Paper.js and set up full-window canvas
  paper.install(window);
  const canvas = document.getElementById('gameCanvas');

  // State variables
  let desiredItemWidth, startX, startY, spacing;
  let faucetRegion, stoveRegion, boardRegion;
  let dropTarget, stoveTarget, boardTarget;
  let currentBg = null;

  // Draggables
  let potEmpty, potFull, saltShaker, potatoRaster;
  let cucumberRaster, tomatoRaster, knifeRaster;

  // Game state
  let potOnStove = false;
  let potatoAdded = false;
  let boardOccupied = false;
  let boardVeggie = null;
  let boardVeggieSliced = false;

  // Salt prompt state
  let handfulCount = 0, pinchCount = 0;
  let originalSaltPos;

  // Original positions for resets
  let potatoOriginalPos, cucumberOriginalPos, tomatoOriginalPos, knifeOriginalPos;

  // Resize and render targets
  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    if (paper.view) paper.view.viewSize = new Size(w, h);

    computeGeometry();
    [dropTarget, stoveTarget, boardTarget].forEach(t => t && t.remove());
    drawDropTarget(); drawStoveTarget(); drawBoardTarget();
  }
  window.addEventListener('resize', resizeCanvas);

  // Initialise Paper
  paper.setup(canvas);
  resizeCanvas();

  function computeGeometry() {
    const vb = view.bounds;
    desiredItemWidth = vb.width * 0.1;
    startX = vb.left + vb.width * 0.15;
    startY = vb.top + vb.height * 0.2;
    spacing = vb.height * 0.15;

    faucetRegion = new Rectangle(
      vb.center.add(new Point(-vb.height * 0.1, -vb.height * 0.4)),
      new Size(vb.width * 0.23, vb.height * 0.32)
    );
    stoveRegion = new Rectangle(
      vb.center.add(new Point(vb.height * 0.5, -vb.height * 0.4)),
      new Size(vb.width * 0.22, vb.height * 0.32)
    );
    boardRegion = new Rectangle(
      vb.center.add(new Point(-vb.height * 0.38, -vb.height * 0.23)),
      new Size(vb.width * 0.16, vb.height * 0.2)
    );
  }

  function drawDropTarget() {
    dropTarget = new Path.Rectangle({ rectangle: faucetRegion, strokeColor: 'red', strokeWidth: 2, dashArray: [10,10] });
    dropTarget.sendToBack();
  }

  function drawStoveTarget() {
    stoveTarget = new Path.Rectangle({ rectangle: stoveRegion, strokeColor: potOnStove ? 'green' : 'blue', strokeWidth: 2, dashArray: [10,10] });
    stoveTarget.sendToBack();
  }

  function drawBoardTarget() {
    boardTarget = new Path.Rectangle({ rectangle: boardRegion, strokeColor: boardOccupied ? 'green' : 'blue', strokeWidth: 2, dashArray: [5,5] });
    boardTarget.sendToBack();
  }

  // Clear initial
  project.activeLayer.removeChildren();
  computeGeometry(); drawDropTarget(); drawStoveTarget(); drawBoardTarget();

  // Cutting board graphic
  new Raster({ source: 'static/images/cutting_board.png', onLoad() {
    const scale = boardRegion.width / this.width;
    this.scale(scale);
    this.position = boardRegion.center;
    this.sendToBack();
  }});

  // Background helper
  const bgWidthFrac = 0.7, bgMarginLeftFrac = 0.3;
  function swapBackground() {
    if (currentBg) background.remove();
    currentBg = currentBg === 'kitchen_bg.png' ? 'kitchen_bg_2.png' : 'kitchen_bg.png';
    background = new Raster({ source: `static/images/${currentBg}`, onLoad() {
      const vb = view.bounds;
      const targetWidth = vb.width * bgWidthFrac;
      const scale = targetWidth / this.width;
      this.scale(scale);
      const centerX = vb.left + vb.width * bgMarginLeftFrac + targetWidth/2;
      this.position = new Point(centerX, vb.center.y);
      this.sendToBack();
    }});
  }
  swapBackground();

  // Filling pot
  function startFilling() {
    swapBackground();
    const pos = potEmpty.position.clone(); potEmpty.remove();
    potFull = new Raster({ source: 'static/images/pot_full.png', onLoad() {
      const s = desiredItemWidth/this.width; this.scale(s);
      this.position = pos; this.bringToFront();
      this.onMouseDrag = e => this.position = this.position.add(e.delta);
      this.onMouseUp = () => {
        if (!potOnStove && this.bounds.intersects(stoveRegion)) {
          potOnStove = true;
          stoveTarget.strokeColor = 'green';
          swapBackground();
        }
      };
    }});
  }

  // Salt prompt
  function promptSalt() {
    handfulCount = pinchCount = 0;
    const overlay = $('<div>').css({ position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999 });
    const box = $('<div>').css({ background:'#fff',padding:'20px',borderRadius:'8px',textAlign:'center' });
    box.append('<p>How much salt would you add?</p>');
    const btnH = $('<button>+1 handful</button>').css({margin:'5px'});
    const btnP = $('<button>+1 pinch</button>').css({margin:'5px'});
    const btnD = $('<button>Done</button>').css({margin:'5px'});
    box.append(btnH, btnP, btnD); overlay.append(box); $('body').append(overlay);
    btnH.on('click', () => handfulCount++);
    btnP.on('click', () => pinchCount++);
    btnD.on('click', () => {
      overlay.remove();
      const correct = (handfulCount===1 && pinchCount===0) || (pinchCount===1 && handfulCount===0);
      alert(correct ? 'Correct!' : 'Wrong amount.');
      if (saltShaker && originalSaltPos) { saltShaker.position = originalSaltPos.clone(); saltShaker.bringToFront(); }
    });
  }

  // Draggable helper
  function loadItem(src,x,y,toFaucet=false,toSalt=false,onAfterLoad=null) {
    const r = new Raster({ source: src, onLoad() {
      const s = desiredItemWidth/this.width; this.scale(s);
      this.position = new Point(x,y); this.bringToFront();
      this.onMouseDrag = e => this.position = this.position.add(e.delta);
      if (toFaucet) this.onMouseUp = () => { if (this.bounds.intersects(faucetRegion)) startFilling(); };
      if (toSalt) { saltShaker = this; originalSaltPos = this.position.clone(); this.onMouseUp = () => { if (potOnStove && this.bounds.intersects(stoveRegion)) promptSalt(); }; }
      if (onAfterLoad) onAfterLoad(this);
    }});
    return r;
  }

  // Create items
  potEmpty = loadItem('static/images/pot_empty.png', startX, startY, true);
  potatoRaster = loadItem('static/images/potato.png', startX, startY+spacing, false,false,item=>{
    potatoOriginalPos = item.position.clone();
    item.onMouseUp = function() {
      if (potOnStove && potFull && !potatoAdded && this.bounds.intersects(potFull.bounds)) {
        const pos = potFull.position.clone(); potFull.remove();
        potFull = new Raster({ source:'static/images/pot_potato.png', onLoad(){ const fs=desiredItemWidth/this.width; this.scale(fs); this.position=pos; this.bringToFront(); }});
        potatoAdded=true; this.remove();
      } else this.position=potatoOriginalPos.clone();
    };
  });
  cucumberRaster = loadItem('static/images/cucumber.png', startX, startY+spacing*2, false,false,item=>{
    cucumberOriginalPos=item.position.clone();
    item.onMouseDown = function(){ if(boardOccupied && this.bounds.intersects(boardRegion)){ boardOccupied=false; boardVeggie=null; boardVeggieSliced=false; drawBoardTarget(); }};
    item.onMouseUp = function(){ if(!boardOccupied && this.bounds.intersects(boardRegion)){ boardOccupied=true; boardVeggie='cucumber'; drawBoardTarget(); this.position=boardRegion.center.clone(); } else this.position=cucumberOriginalPos.clone(); };
  });
  tomatoRaster = loadItem('static/images/tomato.png', startX, startY+spacing*3, false,false,item=>{
    tomatoOriginalPos=item.position.clone();
    item.onMouseDown = function(){ if(boardOccupied && this.bounds.intersects(boardRegion)){ boardOccupied=false; boardVeggie=null; boardVeggieSliced=false; drawBoardTarget(); }};
    item.onMouseUp = function(){ if(!boardOccupied && this.bounds.intersects(boardRegion)){ boardOccupied=true; boardVeggie='tomato'; drawBoardTarget(); this.position=boardRegion.center.clone(); } else this.position=tomatoOriginalPos.clone(); };
  });
  saltShaker = loadItem('static/images/salt_shaker.png', startX, startY+spacing*4, false,true,item=>{ item.scale(0.5); });
  knifeRaster = loadItem('static/images/knife.png', startX, startY+spacing*5, false,false,item=>{
    knifeOriginalPos = item.position.clone();
    item.onMouseDrag = e => item.position = item.position.add(e.delta);
    item.onMouseUp = function() {
      if(boardOccupied && boardVeggie && !boardVeggieSliced && this.bounds.intersects(boardRegion)){
        if(boardVeggie==='cucumber') cucumberRaster.remove();
        if(boardVeggie==='tomato') tomatoRaster.remove();
        new Raster({ source:`static/images/${boardVeggie}_sliced.png`, onLoad(){ const s=desiredItemWidth/this.width; this.scale(s); this.position=boardRegion.center.clone(); this.bringToFront(); }});
        boardVeggieSliced = true;
      }
      item.position = knifeOriginalPos.clone();
      item.bringToFront();
    };
  });
});
