$(document).ready(function () {
    // скрываем кнопку добавления проекта
    $('.project__create').css('display', 'none')

    // установка обработчика для всех элементов списков
    $('.project__item').on('click', function (event) {
        // скрываем кнопку завершения проекта
        $('.closeProject').css('display', 'none')

        // скрываем кнопку добавления задачи
        $('.add').css('display', 'none')
        $('.tasks__control').css('display', 'none')

        let $item
        $('.project__item.active').removeClass('active')
        $('.tasks__wrapper').css('display', 'flex')

        if (event.target.tagName !== 'LI') {
            $item = $($(event).get(0).currentTarget).addClass('active')
            $('.tasks_title').text()
        } else {
            $item = $(event.target).addClass('active')
        }


        if ($item.attr('data-status') === '1') {
            $('.tasks__table').css('display', 'none')

        } else {
            $('.tasks__table').css('display', 'table')
        }

        const title = $item.children('.project__name').text()
        $('.tasks__title').text(title)

        $.ajax({
            type: 'POST',
            url: '/userInfo',
            data: {
                project_id: $item.attr('data-id')
            }
        }).done(msg => {
            console.log(msg)
            $('.tasks__table > tbody > tr.task-info').remove()
            $('.tasks__table-ready > tbody > tr.task-info').remove()

            showTasks(msg)

        }).fail(err => {
            console.log(err)
        })
    })

    function showTasks(data) {
        let $table = $('.tasks__table > tbody')
        if (data.length !== 0) {
            if (data.progress !== []) {
                for (let i = 0; i < data.progress.length; i++) {
                    $table.append(
                        $('<tr>').append([
                            $('<td>').text(data.progress[i].title),
                            // $('<td>').text(data.progress[i].description),
                            $('<td>').text(data.progress[i].time_start),
                            $('<td>').text(data.progress[i].time_end),
                            $('<td>').text(data.progress[i].name),
                            $('<td>').text(data.progress[i].first_name + ' ' + data.progress[i].last_name),
                            $('<td>').append(
                                $('<button>')
                                .text('Выполнено')
                                .attr('data-id', data.project_id)
                                .addClass('del')
                                .on('click', closeTask.bind(this, data.progress[i].id))
                            )
                        ]).addClass('task-info')
                    )
                }
                $table = $('.tasks__table-ready > tbody')
                for (let i = 0; i < data.ready.length; i++) {
                    $table.append(
                        $('<tr>').append([
                            $('<td>').text(data.ready[i].title),
                            // $('<td>').text(data.ready[i].description),
                            $('<td>').text(data.ready[i].time_start),
                            $('<td>').text(data.ready[i].time_end),
                            $('<td>').text(data.ready[i].name),
                            $('<td>').text(data.ready[i].first_name + ' ' + data.ready[i].last_name),
                            $('<td>').text('Выполнено')
                        ]).addClass('task-info')
                    )
                }
            } else {
                $table = $('.tasks__table-ready > tbody')
                for (let i = 0; i < data.ready.length; i++) {
                    $table.append(
                        $('<tr>').append([
                            $('<td>').text(data.ready[i].title),
                            // $('<td>').text(data.ready[i].description),
                            $('<td>').text(data.ready[i].time_start),
                            $('<td>').text(data.ready[i].time_end),
                            $('<td>').text(data.ready[i].name),
                            $('<td>').text(data.ready[i].first_name + ' ' + data.ready[i].last_name),
                            $('<td>').text('Выполнено')
                        ]).addClass('task-info')
                    )
                }
            }
        }
    }

    function closeTask(task_id, event) {
        const $row = $(event.currentTarget).parent().parent()

        $.ajax({
            type: 'POST',
            url: '/closeTask',
            data: {
                task_id
            }
        }).done(msg => {
            const test = $row.clone()
            $row.remove()
            $($(test[0].lastElementChild).children()[0]).remove()
            $(test[0].lastElementChild).text('Выполнено')
            $('.tasks__table-ready > tbody').append(test)
        }).fail(err => {
            console.log(err)
        })
    }
})