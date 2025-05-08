// static/quiz.js
$(function() {
  let currentIndex  = 0;
  const total       = questionKeys.length;
  const userResults = [];

  function render() {
    const qId = questionKeys[currentIndex];
    const q   = quizData[qId];
    $('#quiz_container').empty();

    // QUESTION TEXT
    $('#quiz_container').append(
      $('<h4>').text(`Q${currentIndex+1}. ${q.question}`)
    );

    // DISPATCH BY TYPE
    if (q.type === 'multiple_choice') return renderMC(q);
    if (q.type === 'sort_into_categories') return renderSort(q);
    if (q.type === 'put_in_order') return renderOrder(q);
    if (q.type === 'choose_video') return renderVideo(q);
  }

  // 1) Multiple Choice
  function renderMC(q) {
    const $form = $('<form>');
    for (let a in q.answers) {
      const $lbl = $('<label class="d-block">');
      $('<input>')
        .attr({ type: 'radio', name: 'answer', value: a })
        .appendTo($lbl);
      $lbl.append(` ${q.answers[a]}`);
      $form.append($lbl);
    }
    $('<button class="btn btn-primary mt-3">Submit</button>')
      .appendTo($form)
      .click(e => {
        e.preventDefault();
        const chosen = parseInt($form.find('input[name=answer]:checked').val());
        const ok     = chosen === q.correct_answer;
        userResults.push({ id: q.id, correct: ok });
        showFeedback(ok, q.answers[q.correct_answer]);
      });
    $('#quiz_container').append($form);
  }

  // 2) Sort into categories
  // 2) Sort into categories
function renderSort(q) {
  $('#quiz_container').empty();

  // 1) Question text (if not already appended)
  $('#quiz_container').append(
    $('<h4>').text(`Q${currentIndex+1}. ${q.question}`)
  );

  // 2) POOL of draggable options
  const $pool = $('<div class="pool mb-4">');
  Object.entries(q.options).forEach(([o, opt]) => {
    $('<div>')
      .attr('id', `opt_${o}`)
      .addClass('alert alert-secondary draggable')
      .text(opt.text)
      .draggable({
        helper: 'clone',
        revert: 'invalid',
        start(e, ui) { ui.helper.css('opacity', 0.7); },
        stop(e, ui) { ui.helper.css('opacity', 1); }
      })
      .appendTo($pool);
  });
  $('#quiz_container').append($pool);

  // 3) TARGET drop‐zones
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
          // Move the original into here
          const $orig = ui.draggable;
          const $moved = $orig.clone()
            .removeClass('draggable')
            .addClass('dropped')
            .css({ cursor: 'default' });
          $orig.remove();
          $(this).append($moved);
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
        const tgt = opt.target.toString();
        // Look for the moved clone in the correct drop-box
        if ($(`.drop-box[data-target="${tgt}"] #opt_${o}`).length) {
          correct++;
        }
      });
      userResults.push({ id: q.id, correct, outOf: total });
      showFeedback(correct === total, `${correct} / ${total}`);
    });
}



  // 3) Put in order
  function renderOrder(q) {
    const $ol = $('<ol id="order_list" class="list-group mb-3">');
    // shuffle for display
    const keys = Object.keys(q.options).sort(() => 0.5 - Math.random());
    keys.forEach(o => {
      $('<li>')
        .attr('id', 'opt_'+o)
        .addClass('list-group-item')
        .text(q.options[o].text)
        .appendTo($ol);
    });
    $('#quiz_container').append($ol);
    $ol.sortable().disableSelection();

    $('<button class="btn btn-primary">Submit</button>')
      .appendTo('#quiz_container')
      .click(e => {
        e.preventDefault();
        const arr = $('#order_list').sortable('toArray');
        let correct = 0;
        arr.forEach((id, idx) => {
          const key = id.replace('opt_','');
          if (q.options[key].order === idx+1) correct++;
        });
        userResults.push({ id: q.id, correct, outOf: arr.length });
        showFeedback(correct===arr.length, `${correct} / ${arr.length}`);
      });
  }

  // 4) Choose video
  function renderVideo(q) {
    for (let o in q.options) {
      const opt = q.options[o];
      // video element
      $('#quiz_container').append(
        $('<video controls class="d-block mb-2">')
          .attr('src', opt.video)
          .css('width','100%')
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

  // FEEDBACK + NAVIGATION
  function showFeedback(isCorrect, extra) {
    $('#quiz_container').append(
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
      .appendTo('#quiz_container');
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
