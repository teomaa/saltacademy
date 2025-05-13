// learning_page.js

// Renders the "big_graphic" layout
displayBigGraphic = function(desc, items) {
  const $main = $('#main_container').empty();

  // Left column: title, icons, description, back link
  const $left = $('<div class="col-md-6">')
    .append($('<h2 class="text-black">').text(desc.title));

  // Icons for each item
  const $iconRow = $('<div class="mb-3">');
  items.forEach(item => {
    $('<img>')
      .attr('src', "/static/images/" + item.icon)
      .attr('alt', item.name || item.title)
      .addClass('me-2 img-thumbnail')
      .css({ width: '48px', height: '48px' })
      .appendTo($iconRow);
  });
  $left.append($iconRow);

  // Description text
  $left.append($('<p>').text(desc.description));

  // Back link
  $left.append(
    $('<a>')
      .attr('href', desc.back_url)
      .addClass('btn btn-outline-secondary mt-3')
      .text('← Back')
  );

  // Right column: main graphic
  const $right = $('<div class="col-md-6 text-center">')
    .append(
      $('<img>')
        .attr('src', "/static/images/" + desc.main_graphic)
        .attr('alt', desc.title)
        .addClass('img-fluid rounded')
    );

  // Assemble row
  $('<div class="row">')
    .append($left)
    .append($right)
    .appendTo($main);
};

// Renders the "tri_text" layout
// Renders the "tri_text" layout as two columns:
// left: stacked icon+text areas; right: main graphic
// Renders the "tri_text" layout as two columns,
// with alternating left/right alignment per text block.
displayTriText = function(desc) {
  const $main = $('#main_container').empty();

  // Left column (8/12)
  const $left = $('<div class="col-md-8">')
    .append($('<h2 class="mb-4">').text(desc.title));

  ['area_1','area_2','area_3'].forEach((key, idx) => {
    const area    = desc[key];
    const isRight = idx % 2 === 1;

    const $block = $('<div>')
      .addClass('w-75 mb-5')
      .addClass(isRight ? 'ms-auto text-end' : 'text-start');

    const $icons = $('<div class="mb-2 d-flex">')
      .addClass(isRight ? 'justify-content-end' : 'justify-content-start');
    area.icons.forEach(url => {
      $('<img>')
        .attr('src', '/static/images/' + url)
        .addClass('mx-1')
        .css({ width: '32px', height: '32px' })
        .appendTo($icons);
    });

    $block.append($icons)
          .append($('<p>').text(area.description));
    $left.append($block);
  });

  $left.append(
    $('<a>')
      .attr('href', desc.back_url)
      .addClass('btn btn-outline-secondary')
      .text('← Back')
  );

  // Right column (4/12): use flex to vertically center; image fills width
  const $right = $('<div class="col-md-4 d-flex align-items-center">')
    .append(
      $('<img>')
        .attr('src', '/static/images/' + desc.main_graphic)
        .attr('alt', desc.title)
        .addClass('img-fluid rounded w-100')
    );

  // Row wrapper with vertical centering
  $('<div class="row align-items-center">')
    .append($left)
    .append($right)
    .appendTo($main);
};








// Renders the "advancable_big_graphic" layout with navigation arrows
displayAdvancableBigGraphic = function(desc) {
  const $main = $('#main_container').empty();

  // Header: title and description
  const $header = $('<div class="row text-center mb-4">')
    .append(
      $('<div class="col">')
        .append($('<h2>').text(desc.title))
        .append($('<p>').text(desc.description))
    );
  $main.append($header);

  // Navigation row: prev arrow, image, next arrow
  const $nav = $('<div class="row justify-content-center align-items-center mb-4">');

  // Prev arrow
  const $prevCol = $('<div class="col-auto">');
  if (desc.prev_id) {
    $prevCol.append(
      $('<a>')
        .attr('href', `${desc.back_url}/${desc.prev_id}`)
        .addClass('btn btn-link fs-1')
        .text('←')
    );
  }
  $nav.append($prevCol);

  // Center image
  $nav.append(
    $('<div class="col-auto">')
      .append(
        $('<img>')
          .attr('src', "/static/images/" + desc.img)
          .attr('alt', desc.title)
          .addClass('img-fluid rounded')
      )
  );

  // Next arrow
  const $nextCol = $('<div class="col-auto">');
  if (desc.next_id) {
    $nextCol.append(
      $('<a>')
        .attr('href', `${desc.back_url}/${desc.next_id}`)
        .addClass('btn btn-link fs-1')
        .text('→')
    );
  }
  $nav.append($nextCol);

  $main.append($nav);

  // Back link
  $main.append(
    $('<div class="text-center">')
      .append(
        $('<a>')
          .attr('href', desc.back_url)
          .addClass('btn btn-outline-secondary')
          .text('← Back')
      )
  );
};

// Renders the "popover_info" layout with uniform image sizes
// and popovers triggered on hover
displayPopoverInfo = function(desc, items) {
  const $main = $('#main_container').empty();

  $('#main_container').append(`<h2 class="text-black">${item_description.page_title}</h2>`)
  $('#main_container').append(`<p>${item_description.page_subtitle}</p>`)

  items.forEach(item => {
    // Determine correct image source
    let imgSrc;
    if (item.img) {
      if (item.img.startsWith('/') || item.img.startsWith('http')) {
        imgSrc = item.img;
      } else {
        imgSrc = `/static/images/${item.img}`;
      }
    } else {
      const fileName = item.title.toLowerCase().replace(/\s+/g, '_') + '.png';
      imgSrc = `/static/images/${fileName}`;
    }

    const $col = $(
      `<div class="col-md-4 text-center mb-4">
         <img src="${imgSrc}" alt="${item.title}"
              class="rounded clickable-item"
              style="width:300px; height:300px; object-fit:contain;"
              tabindex="0"
              data-bs-toggle="popover"
              data-bs-trigger="hover focus"
              data-bs-html="true"
              data-bs-content="<h5>${item.title}</h5><p>${item.description}</p>">
         <div class="mt-2">${item.title}</div>
       </div>`
    );
    $main.append($col);
  });

    // Back link
  $main.append(
    $('<div class="text-center">')
      .append(
        $('<a>')
          .attr('href', desc.back_url)
          .addClass('btn btn-outline-secondary')
          .text('← Back')
      )
  );

  // Initialize Bootstrap popovers on hover
  document.querySelectorAll(
    '#main_container [data-bs-toggle="popover"]'
  ).forEach(el => {
    new bootstrap.Popover(el, { trigger: 'hover focus' });
  });
};

// On document ready, dispatch based on layout_type
$(document).ready(function() {
  $('#main_container').empty();
  const layout = item_description.layout_type;
  switch (layout) {
    case 'big_graphic':
      displayBigGraphic(item_description, items);
      break;
    case 'tri_text':
      displayTriText(item_description);
      break;
    case 'advancable_big_graphic':
      displayAdvancableBigGraphic(item_description);
      break;
    case 'popover_info':
      displayPopoverInfo(item_description, items);
      break;
    default:
      $('#main_container').text('Unknown layout type.');
  }
});
