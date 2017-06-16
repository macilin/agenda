function onClickMeeting(title) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(argument) {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      $('#deleteTitle').attr('value', title);
      $('#sponsor_list').empty();
      $('#participator_list').empty();
      var obj = $.parseJSON(xmlhttp.responseText);
      $('#sponsor_list').append('<tr><td class="hover">' + obj["sponsor"] + '</td></tr>');
      for (par in obj["participators"]) {
        $('#participator_list').append('<tr><td class="hover">' + obj["participators"][par] + '</td></tr>');
      }
      if (obj["sponsor"] == $('dtcdata#data_username').attr('data')) {
        $('#meetingModal #deleteMeetingForm').removeClass("hidden");
      } else {
        $('#meetingModal #deleteMeetingForm').addClass("hidden");
      }
    }
  };

  xmlhttp.open("POST", "/query_meeting_member", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("title=" + String(title));
}

// Click event on tabs
$('#tabs a').click(function(e) {
  e.preventDefault();
  var ref = $(this).attr('href');
  // operation on tab buttons
  $('#right-layout .active').removeClass("active");
  $(this).parent().addClass("active");
  // operation on tabs
  $('#right-layout .show').addClass('hidden');
  $('#right-layout .show').removeClass('show');
  $(ref).removeClass('hidden');
  $(ref).addClass('show');
});

count = 1;
// Initialize newMeetingModal
function initializeNewMeetingModal() {
  var par_list = $('#newMeetingModal #participators_list');
  par_list.empty();
  var add_par = $('<select class="form-control single" name="participators"></select>');
  par_list.append(add_par);
  count = 1;
  add_par.attr('id', "new_meeting_select_id_" + String(count))
  query_user(count);
}

// Click event on select participator
function query_user(id) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(argument) {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var obj = $.parseJSON(xmlhttp.responseText);
      for (i in obj) {
        var toappend = $('#new_meeting_select_id_' + String(id));
        toappend.append($('<option>' + String(obj[i].username) + '</option>'));
      }
    }
  };
  xmlhttp.open("POST", "/query_all_users", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
}

// Click add participator
$('#addParticipator').click(function(e) {
  var par_list = $('#newMeetingModal #participators_list');
  var first_ele = $('#newMeetingModal #participators_list select:first-child');
  var last_ele = $('#newMeetingModal #participators_list select:last-child');
  var add_par = $('<select class="form-control" name="participators"></select>')
  last_ele.removeClass("tail");
  last_ele.addClass("mid");
  par_list.append(add_par);
  add_par.addClass('tail');
  if (count == 1) {
    first_ele.removeClass('mid');
    first_ele.removeClass('single');
    first_ele.addClass('head');
  }
  count++;
  add_par.attr("id", 'new_meeting_select_id_' + String(count));
  query_user(count);
});
