/*global $ */
// wait for the page to load.
$(document).ready(function () {
  console.log('main.js linked')
  $('#add').on('click', ajaxAddItem)
  showList()
})

function ajaxAddItem (ev) {
  // prevent the form from sending the page anywhere
  ev.preventDefault()
  console.log('form submitted', ev)
  var name = $('form input')[0].value
  var score = $('form input')[1].value
  var params = {name: name, score: score}
  console.log('sending:', params)

  $.post('/entries', params, function (data) {
    console.log('pushing: ', data)
    showList()
  })
}

function showList () {
  $.ajax({
    url: 'http://localhost:3000/entries',
    type: 'GET'
  })
    .done(function (data) {
      console.log('success')
      $('main').empty()
      data.forEach(function (elem, index) {
        $('main').append('<div class="card"  id="' + elem.id + '">' +
          '<div class="card-header"> name: ' + elem.name + '</div>' +
          '<div class="card-block"> score: ' + elem.score + '</div>' +
          '<div>' + '<button class="edit"> Edit </button>' +
          '<button class="delete"> Delete </button>' + '</div>' +
          '</div>')
      })
      $('.delete').on('click', function () {
        console.log('delete clicked')
        var id = $(this).parent().parent().attr('id')
        console.log('id selected: ' + id)
        deleteScore(id)
      })

      $('.edit').on('click', function () {
        console.log('edit clicked')
        var id = $(this).parent().parent().attr('id')
        console.log('id selected: ' + id)
        editScore(id)
      })
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      console.log('complete')
    })
}

function editScore (id) {
  console.log('edit item: ' + id)
  $.ajax({
    url: 'http://localhost:3000/entries/' + id + '/edit',
    type: 'GET'
  })
    .done(function (data) {
      console.log('success')
      console.log(data)
      console.log('data.name', data.name)
      $('#' + id).empty()
      $('#' + id).append('<form><input type="text" id="newname" value="' + data.name + '"><input type="number" id="newscore" value="' + data.score + '"><button class="save" type="submit">Save</button></form>')

      $('.delete').on('click', function () {
        console.log('delete clicked')
        var id = $(this).parent().parent().attr('id')
        console.log('id selected: ' + id)
        deleteScore(id)
      })

      $('.save').on('click', function (ev) {
        ev.preventDefault()
        console.log('save clicked')
        var id = $(this).parent().parent().attr('id')
        var name = $('#newname').val()
        console.log('name: ', name)
        var score = $('#newscore').val()
        console.log('score: ', score)
        console.log('id selected: ' + id)
        var params = {id: id, name: name, score: score}
        putScore(params)
        // putScore(id: id, name: name, score: score)
        showList()
      })
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      console.log('complete')
    })
}

function deleteScore (scoreId) {
  $.ajax({
    url: 'http://localhost:3000/entries/' + scoreId,
    type: 'DELETE'
  }).done(function (data) {
    console.log('success deleting score')
    showList()
  }).fail(function () {
    console.log('error deleting score')
  })
}

function putScore (data) {
  console.log('data: ', data)
  $.ajax({
    url: 'http://localhost:3000/entries/' + data.id,
    type: 'PUT',
    data: data,
    dataType: 'json'
  }).done(function (data) {
    console.log('success putting score')
    showList()
  }).fail(function () {
    console.log('error putting score')
  })
}
