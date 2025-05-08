  $(function() {
    // var p = {{ progress|tojson }};
    var percent = Math.round((progress.n_completed_steps / progress.total_steps) * 100);
    $('.progress-bar')
      .css('width', percent + '%')
      .attr('aria-valuenow', p.n_completed_steps)
      .attr('aria-valuemax', p.total_steps)
      .text(percent + '%');
  });