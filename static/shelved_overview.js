// shelved_overview.js

// Uses Paper.js to draw two fully 3D shelves and place clickable item images
$(function() {
  // Render the page title
  function displayTitle(title) {
    $('#title_container').empty();
    if (title.url) {
      const $link = $('<a>').attr('href', title.url).text(title.text);
      $('#title_container').append($('<h1>').append($link));
    } else {
      $('#title_container').append($('<h1>').text(title.text));
    }
  }
  displayTitle(data.title);

  // Prepare shelf canvas container
  const $container = $('#shelf_container').empty();
  const containerWidth = $container.width();
  const containerHeight = $(window).height() * 0.8;
  const $canvas = $('<canvas>')
    .attr({ id: 'shelfCanvas', width: containerWidth, height: containerHeight })
    .css({ display: 'block', margin: '0 auto' });
  $container.append($canvas);

  // Tighten title spacing
  $('#title_container h1').css({ 'margin-top': '0', 'margin-bottom': '10px' });

  // Initialize Paper.js
  paper.install(window);
  paper.setup($canvas[0]);

  // Prepare items array
  const itemsArray = Array.isArray(data.items) ? data.items : Object.values(data.items);
  const midpoint = Math.ceil(itemsArray.length / 2);
  const shelves = [ itemsArray.slice(0, midpoint), itemsArray.slice(midpoint) ];

  // Shelf geometry
  const shelfWidth = containerWidth * 0.98;      // nearly full width
  const shelfDepth = containerWidth * 0.05;      // perspective depth
  const shelfThickness = 15;                     // front face height
  const shelfX = (containerWidth - shelfWidth) / 2;
  const shelfY1 = containerHeight * 0.35;
  const shelfY2 = containerHeight * 0.7;

  // Draw fully 3D shelves
  [shelfY1, shelfY2].forEach(baseY => {
    // Top face (parallelogram)
    new Path({
      segments: [
        [shelfX, baseY],
        [shelfX + shelfDepth, baseY - shelfDepth],
        [shelfX + shelfWidth + shelfDepth, baseY - shelfDepth],
        [shelfX + shelfWidth, baseY]
      ],
      fillColor: '#C28840',
      closed: true
    });
    // Front face (rectangle)
    new Path.Rectangle({
      point: [shelfX, baseY],
      size: [shelfWidth, shelfThickness],
      fillColor: '#8B4513'
    });
    // Right side face (parallelogram)
    new Path({
      segments: [
        [shelfX + shelfWidth, baseY],
        [shelfX + shelfWidth + shelfDepth, baseY - shelfDepth],
        [shelfX + shelfWidth + shelfDepth, baseY - shelfDepth + shelfThickness],
        [shelfX + shelfWidth, baseY + shelfThickness]
      ],
      fillColor: '#A05511',
      closed: true
    });
  });

  // Desired image width
  const desiredWidth = containerWidth * 0.12;

  // Place items on 3D shelves
  shelves.forEach((shelfItems, row) => {
    const baseY = row === 0 ? shelfY1 : shelfY2;
    const count = shelfItems.length;
    const spacing = shelfWidth / (count + 1);

    shelfItems.forEach((item, i) => {
      // Resolve image source
      let imgSrc = item.icon;
      if (!imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
        imgSrc = `/static/images/${imgSrc}`;
      }

      // Create raster and position on load
      const raster = new Raster({ source: imgSrc });
      raster.onLoad = function() {
        const scale = desiredWidth / this.width;
        this.scale(scale);
        // position image so bottom aligns with front of shelf
        const px = shelfX + spacing * (i + 1) + shelfDepth / 2;
        const py = baseY - shelfDepth / 2 - (this.bounds.height / 2);
        this.position = new Point(px, py);
      };

      // Click handler to navigate
      raster.onClick = function() {
        window.location.href = `${window.location.href}/${item.description_id}`;
      };
      raster.cursor = 'pointer';
    });
  });


    // Next button logic
  const currentPath = window.location.pathname;
  let nextPath = null;
  if (currentPath.startsWith('/meat')) {
    nextPath = '/vegetables';
  } else if (currentPath.startsWith('/vegetables')) {
    nextPath = '/quiz';
  }
  if (nextPath) {
    // Map routes to display names
    const labelMap = {
      '/vegetables': 'Veggies',
      '/quiz': 'Quiz'
    };
    const displayText = 'Continue to ' + (labelMap[nextPath] || 'Next');

    const $btn = $('<a>')
      .attr('href', nextPath)
      .addClass('btn btn-primary')
      .text(displayText);

    $('#nextbutton_container')
      .css({ 'text-align': 'center', 'margin': '20px 0' })
      .empty()
      .append($btn);
  }
});
