'use strict';

$('#showUpdateForm').click(function () {
  $('#updateForm').toggle();
});

  
function hide() {
  $('#list').fadeOut(0);
  $('#close , #list-item').fadeIn(1000);
}

function show() {
  $('#list').fadeIn(1000);
  $('#close , #list-item').fadeOut(0);
}


