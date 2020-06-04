const $createProjectBtn = $('.project-wrapper__create')
const $closeModal = $('.js-modal-close')

const $modal = $('.main-wrapper__modal')
const $overlay = $('.main-wrapper__overlay')

const $addTaskBtn = $('.project-info-wrapper__add')

$createProjectBtn.on('click', e => {
  e.preventDefault()
  $modal.addClass('active')
  $overlay.addClass('active')
})

$closeModal.on('click', e => {
  e.preventDefault()
  $modal.removeClass('active')
  $overlay.removeClass('active')
})

$overlay.on('click', () => {
  $modal.removeClass('active')
  $overlay.removeClass('active')
})

$('.project-info-wrapper__finish-project').on('click', function () {
  const projectTitle = $($(this).parent().parent().children()[0]).text()
  console.log(projectTitle)
})

$('.main-wrapper__create-project').submit(function (e) {
  e.preventDefault()

  const $form = $(this)
  const data = $form.serializeArray()
  const color = getColor()
  data.push({
    name: 'pic',
    value: color
  })

  $.ajax({
    type: $form.attr('method'),
    url: $form.attr('action'),
    data: data
  }).done(msg => {

    addProjectOnList(data[0].value, color)
    $modal.removeClass('active')
    $overlay.removeClass('active')

  }).fail(err => {
    console.log('error', err.status)
  })
})

function addProjectOnList(name, color) {
  const $list = $('.project-wrapper__progress > ul')
  const $item = $('<li>').addClass('project-wrapper__item')
  const $pic = $('<div>').addClass('project-wrapper__pic')
  const $name = $('<div>').addClass('project-wrapper__name')

  $pic.css('background-color', color)
  $name.text(name)
  $item.append([$pic, $name])

  // $('.project-wrapper__item.active').removeClass('active')
  // $item.addClass('active')

  $item.on('click', function (event) {
    $('.project-wrapper__item.active').removeClass('active')
    $(this).addClass('active')
    // вынести в функцию
    const $table = $('.project-info-wrapper__table-ready > tbody')
    const rows = $table.children()
    for (let i = 1; i < rows.length; i++) $(rows[i]).remove()
    $('.project-info-wrapper__left > div').text(name)
    showInfoAboutProject($(this).children('.project-wrapper__name').text())
    $('.project-info-wrapper__blank').css('display', 'table-row')
  })

  $list.append($item)
}

// Устанавливаем обработчики на каждый элемент списка
// чтобы выводить подробную информацию по выбранному проекту
$.each($('.project-wrapper__list'), (i, e) => {
  $.each($(e).children(), (j, item) => {
    $(item).on('click', function (event) {
      const title = $(this).children('.project-wrapper__name').text()

      if (!$(this).is('.active')) {
        const $table = $('.project-info-wrapper__table-ready > tbody')
        const rows = $table.children()
        for (let i = 1; i < rows.length; i++) $(rows[i]).remove()
        $('.project-wrapper__item.active').removeClass('active')
        $(this).addClass('active')
        $('.project-info-wrapper__left > div').text(title)
        showInfoAboutProject(title)
        $('.project-info-wrapper__blank').css('display', 'table-row')
      }
    })
  })
})

function showInfoAboutProject(title) {
  $.ajax({
    type: 'POST',
    url: '/infoProject',
    data: {
      title
    }
  }).done(msg => {
    const tasks = msg.tasks

    if (tasks.length !== 0) {
      for (let i = 0; i < tasks.length; i++) {
        addTaskToTable(tasks[i])
      }
    }

  }).fail(err => {
    console.log('error', err.status)
  })
}


$addTaskBtn.on('click', function (e) {
  const $row = $($(this).parent().parent()[0])
  const rowData = []
  $.each($row.children(), (i, e) => {
    const data = $($(e).children())[0].value
    if (data != '') rowData.push(data)
  })

  $.ajax({
    type: 'POST',
    url: '/addTask',
    data: {
      title: rowData[0],
      employer: rowData[1],
      time: rowData[2],
      projectTitle: $('.project-info-wrapper__left').text()
    }
  }).done(msg => {
    rowData.id = msg.id
    addTaskToTable(rowData)
  }).fail(err => {
    console.log('error', err.status)
  })

})

function addTaskToTable(rowData) {
  const $table = $('.project-info-wrapper__table-ready > tbody')
  const $tr = $('<tr>')
  for (let key in rowData) {
    if (key !== 'id') {
      const $td = $('<td>').html(rowData[key])
      $tr.append($td)
    }
  }

  const $deleteBtn = $('<button>')
    .addClass('project-info-wrapper__delete')
    .attr({
      'data-id': rowData.id
    })
    .text('Удалить')
    .on('click', function (event) {
      $.ajax({
        type: 'POST',
        url: '/deleteTask',
        data: {
          id: rowData.id
        }
      }).done(msg => {
        $(this).parent().parent().remove()
      }).fail(err => {
        console.log('error', err.status)
      })
    })
  const $deleteTd = $('<td>').append($deleteBtn)
  $tr.append($deleteTd)
  $table.append($tr)
}

function getColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}