$.each($('.project-wrapper__list'), (i, e) => {
    $.each($(e).children(), (j, item) => {
        $(item).on('click', function (event) {
            const title = $(this).children('.project-wrapper__name').text()

            if (!$(this).is('.active')) {
                const $table = $('.user-wrapper__table-ready > tbody')
                const rows = $table.children()
                for (let i = 0; i < rows.length; i++) $(rows[i]).remove()
                $('.project-wrapper__item.active').removeClass('active')
                $(this).addClass('active')
                $('.user-wrapper__left > div').text(title)
                showInfoAboutProject(title)
                $('.project-info-wrapper__blank').css('display', 'table-row')
            }
        })
    })
})

function showInfoAboutProject(title) {
    
    $.ajax({
        type: 'POST',
        url: '/userProjectInfo',
        data: {
            title
        }
    }).done(msg => {
        showInfoUsersProject(msg)
    }).fail(err => {
        console.log('error', err.status)
    })
}

function showInfoUsersProject(data) {
    const $table = $('.user-wrapper__table-body')
    for (let i = 0; i < data.length; i++) {
        const $tr = $('<tr>')
        const $title = $('<td>').text(data[i].title)
        const $time = $('<td>').text(data[i].timeEnd)
        const $done = $('<td>').append($('<button>').attr({ 'data-id': data[i].id }).text('Готово').addClass('done-btn'))
        $table.append($tr.append([$title, $time, $done]))
    }
}