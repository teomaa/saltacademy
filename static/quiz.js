// static/quiz.js
$(function() {
  let currentIndex  = 0;
  const total       = questionKeys.length;
  const userResults = [];

  function render() {
  // reset answered-flag whenever a new question shows up
  $('#quiz_container')
    .empty()
    .data('answered', false);

  const qId = questionKeys[currentIndex];
  const q   = quizData[qId];

  // QUESTION TEXT
  $('#quiz_container').append(
    $('<h4>').text(`Q${currentIndex+1}. ${q.question}`)
  );

  // DISPATCH BY TYPE
  if (q.type === 'multiple_choice')          return renderMC(q);
  if (q.type === 'sort_into_categories')     return renderSort(q);
  if (q.type === 'put_in_order')             return renderOrder(q);
  if (q.type === 'choose_video')             return renderVideo(q);
  if (q.type === 'game')                     return renderGame(q);
}


  // 1) Multiple Choice
// 1) Multiple Choice
function renderMC(q) {
  // Clear out anything below the question
  $('#quiz_container .mc-answers, #quiz_container .mc-submit').remove();

  // Container for the answer buttons
  const $ansWrapper = $('<div class="mc-answers mt-4">');

  // Turn answers object into an array of [key, text]
  const entries = Object.entries(q.answers);

  // Process two answers per row
  for (let i = 0; i < entries.length; i += 2) {
    const $row = $('<div class="row mb-3">').appendTo($ansWrapper);

    // For each half of the row (0 and 1)
    for (let j = 0; j < 2; j++) {
      const idx = i + j;
      if (idx < entries.length) {
        const [key, text] = entries[idx];
        const $col = $('<div class="col-6 d-grid">').appendTo($row);

        $('<button>')
          .addClass('btn btn-secondary')
          .text(text)
          .data('answer', key)
          .click(e => {
            const chosen = parseInt($(e.currentTarget).data('answer'));
            const ok     = chosen === q.correct_answer;
            userResults.push({ id: q.id, correct: ok });
            showFeedback(ok, q.answers[q.correct_answer]);
          })
          .appendTo($col);
      } else {
        // fill empty half if odd number of answers
        $('<div class="col-6">').appendTo($row);
      }
    }
  }

  // Attach them under the question
  $('#quiz_container').append($ansWrapper);
}



  // 2) Sort into categories
  // 2) Sort into categories
function renderSort(q) {
  $('#quiz_container').empty();

  // 1) Question text
  $('#quiz_container').append(
    $('<h4>').text(`Q${currentIndex+1}. ${q.question}`)
  );

  // 2) POOL of draggable options, now alert-primary & shrink-wrapped
  const $pool = $('<div class="pool mb-4">');
  Object.entries(q.options).forEach(([o, opt]) => {
    $('<div>')
      .attr('id', `opt_${o}`)
      .addClass('draggable alert alert-primary d-inline-block me-2 mb-2')
      .text(opt.text)
      .css({ cursor: 'move' })
      .draggable({
        helper: 'clone',
        revert: 'invalid',
        start(e, ui) { ui.helper.css('opacity', 0.7); },
        stop(e, ui)  { ui.helper.css('opacity', 1); }
      })
      .appendTo($pool);
  });
  $('#quiz_container').append($pool);

  // 3) TARGET drop-zones
  const $row = $('<div class="row mb-3">');
  Object.entries(q.targets).forEach(([t, label]) => {
    const $col = $('<div class="col-md-4 text-center">')
      .append($('<h5>').text(label));

    const $box = $('<div>')
      .addClass('drop-box mb-3 p-3')
      .attr('data-target', t)
      .css({
        minHeight: '80px',
        border: '2px dashed #ccc',
        'background-color': '#fafafa'
      })
      .droppable({
        accept: '.draggable',
        hoverClass: 'drop-hover',
        drop(event, ui) {
          // Clone and drop; keep the alert-primary styling
          const $orig  = ui.draggable;
          const $clone = $orig.clone()
            .removeClass('draggable')      // no longer draggable
            .addClass('dropped')           // mark as dropped
            .css({
              cursor: 'default',
              display: 'block',
              margin: '0.25rem auto'
            });
          $orig.remove();
          $(this).append($clone);
        }
      });

    $col.append($box);
    $row.append($col);
  });
  $('#quiz_container').append($row);

  // 4) Submit button
  $('<button class="btn btn-primary">Submit</button>')
    .appendTo('#quiz_container')
    .click(e => {
      e.preventDefault();
      let correct = 0, total = Object.keys(q.options).length;
      Object.entries(q.options).forEach(([o, opt]) => {
        if (
          $(`.drop-box[data-target="${opt.target}"] #opt_${o}`)
            .length
        ) {
          correct++;
        }
      });
      userResults.push({ id: q.id, correct, outOf: total });
      showFeedback(correct === total, `${correct} / ${total}`);
    });
}





  // 3) Put in order
function renderOrder(q) {
  $('#quiz_container').empty();

  $('#quiz_container').append(
    $('<h4>').text(`Q${currentIndex+1}. ${q.question}`)
  );

  // 1) Build the flex row: left label, sortable list, right label
  const $row = $('<div class="row align-items-start mb-3">')
    .append($('<div class="col-auto pe-3">').text(q.left_label));

  const $middleCol = $('<div class="col">');
  const $list = $('<div id="order_list" class="d-flex flex-grow-1">');

  Object.keys(q.options)
    .sort(() => 0.5 - Math.random())
    .forEach(key => {
      const opt = q.options[key];
      const $wrapper = $('<div>')
        .attr('id', 'opt_' + key)
        .addClass('d-flex flex-column align-items-center me-3');

      // grey box around the text
      $('<div>')
        .addClass('bg-light border rounded p-3 mb-1')
        .text(opt.text)
        .appendTo($wrapper);

      // placeholder for explanation
      $('<div>')
        .addClass('explanation text-muted mt-1')
        .appendTo($wrapper);

      $list.append($wrapper);
    });

  $middleCol.append($list);
  $row.append($middleCol)
      .append($('<div class="col-auto ps-3">').text(q.right_label));

  $('#quiz_container').append($row);

  // 2) Make the WRAPPERS sortable along X
  $list.sortable({
    items: '> div',
    axis: 'x',
    containment: 'parent',
    helper: 'clone',
    scroll: false,
    tolerance: 'pointer'
  }).disableSelection();

  // 3) Submit button + logic
  $('<button class="btn btn-primary">Submit</button>')
    .appendTo('#quiz_container')
    .click(e => {
      e.preventDefault();

      const order = $list.sortable('toArray');
      let correct = 0;

      // color boxes & show explanations, count correct
      order.forEach((id, idx) => {
        const key    = id.replace('opt_','');
        const opt    = q.options[key];
        const isGood = (opt.order === idx + 1);
        if (isGood) correct++;

        const $wrapper = $('#' + id);
        // color the grey box
        $wrapper.find('.bg-light')
          .addClass(isGood ? 'border-success' : 'border-danger');

        // fill in explanation under the box
        $wrapper.find('.explanation').text(opt.explanation);
      });

      userResults.push({ id: q.id, correct, outOf: order.length });
      showFeedback(correct === order.length, `${correct} / ${order.length}`);
    });
}






  // 4) Choose video
  function renderVideo(q) {
    for (let o in q.options) {
      const opt = q.options[o];
      // video element
      $('#quiz_container').append(
        $('<img>')
          .attr('src', "/static/images/" + opt.video)
          .attr('alt', opt.alt)
          .css('width','50%')
      );
      // radio
      const $lbl = $('<label class="form-check">');
      $('<input>')
        .attr({type:'radio', name:'video_choice', value:o})
        .addClass('form-check-input')
        .appendTo($lbl);
      $lbl.append(` ${opt.text}`);
      $('#quiz_container').append($lbl);
    }
    $('<button class="btn btn-primary mt-3">Submit</button>')
      .appendTo('#quiz_container')
      .click(e => {
        e.preventDefault();
        const chosen = parseInt($('input[name=video_choice]:checked').val());
        const ok     = q.options[chosen].correct;
        userResults.push({ id: q.id, correct: ok });
        const right = Object.values(q.options).find(o=>o.correct).text;
        showFeedback(ok, right);
      });
  }

  // 4) Choose game
  function renderGame(q) {
      console.log("gsdifjsoidjiodjs")
      $('<canvas id="gameCanvas" resize></canvas>').appendTo('#quiz_container')
      // $('<script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js"></script>').appendTo('#quiz_container')
      $('<script src="static/game.js"></script>').appendTo('#quiz_container')
      $('<div id="nextButtonContainer"></div>').appendTo('#quiz_container')
        // $('<button class="btn btn-secondary mt-3">Skip</button>')
        //       .appendTo('#nextButtonContainer')
        //       .click(e => {
        //         e.preventDefault();
        //         const chosen = parseInt($('input[name=video_choice]:checked').val());
        //         const ok     = false;
        //         userResults.push({ id: q.id, correct: ok });
        //         const right = null;
        //         showFeedback(ok, right);
        //       });
        //
      let nextLabel = 'Skip';
    $('<button id="quizSkipQuestionButton" class="btn btn-secondary mt-2">')
      .text(nextLabel)
      .click(() => {
        if (currentIndex+1 < total) {
          currentIndex++;
          render();
        } else {
          showResults();
        }
      })
      .appendTo('#nextButtonContainer');
     // $('#nextButtonContainer').empty();
   nextLabel = currentIndex+1 < total ? 'Next Question' : 'See Results';
    $('<button id="quizOverNextQuestionButton" class=" btn btn-primary mt-2">')
      .text(nextLabel)
      .click(() => {
        if (currentIndex+1 < total) {
          currentIndex++;
          render();
        } else {
          showResults();
        }
      })
      .appendTo('#nextButtonContainer');


    // $('<button class="btn btn-primary mt-3">Submit</button>')
    //   .appendTo('#quiz_container')
    //   .click(e => {
    //     e.preventDefault();
    //     const chosen = parseInt($('input[name=video_choice]:checked').val());
    //     const ok     = q.options[chosen].correct;
    //     userResults.push({ id: q.id, correct: ok });
    //     const right = Object.values(q.options).find(o=>o.correct).text;
    //     showFeedback(ok, right);
    //   });
  }

  // FEEDBACK + NAVIGATION
function showFeedback(isCorrect, extra) {
  const $quiz = $('#quiz_container');

  // if we've already shown feedback, bail out
  if ($quiz.data('answered')) return;
  $quiz.data('answered', true);

  // disable _all_ buttons & inputs
  $quiz.find('button, input').prop('disabled', true);

  // if you use jQueryUI draggables & sortables, disable them too:
  $quiz.find('.draggable').draggable('disable');
  $quiz.find('#order_list').sortable('disable');

  // now append the feedback + exactly one “Next” button
  $quiz.append(
    $('<div class="mt-3">').html(
      isCorrect
        ? `<p class="text-success">Correct!</p>`
        : `<p class="text-danger">Wrong. Answer: ${extra}</p>`
    )
  );

  const nextLabel = currentIndex+1 < total ? 'Next Question' : 'See Results';
  $('<button class="btn btn-secondary mt-2">')
    .text(nextLabel)
    .click(() => {
      if (currentIndex+1 < total) {
        currentIndex++;
        render();
      } else {
        showResults();
      }
    })
    .appendTo($quiz);
}


  function showResults() {
    $('#quiz_container').empty();
    let correctSum = 0;
    userResults.forEach(r => {
      if (typeof r.correct === 'boolean') {
        if (r.correct) correctSum++;
      } else if (typeof r.correct === 'number' && r.outOf) {
        if (r.correct === r.outOf) correctSum++;
      }
    });
    $('#quiz_container').append(
      $('<h3>').text(`You got ${correctSum} out of ${total} correct`)
    );
  }

  // start
  render();
});
