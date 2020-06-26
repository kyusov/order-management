$(document).ready(function () {
    // скрываем кнопку добавления проекта
    $('.project__create').css('display', 'none')

    // модальное окно для статистики
    // кнопка открытия статистики
    const $statistic = $('.statistic')


    // модальное окно статистики
    const $statisticModal = $('.user__modal')
    const $statisticOverlay = $('.user__overlay')
    const $statisticCloseModal = $('.js-modal-close')

    $statistic.on('click', function () {

        $('.showStat').on('click', function (e) {
            e.preventDefault()
            const table = $(this).parent().serializeArray()

            let data = {}

            for (let i = 0; i < table.length; i++) {
                data[table[i].name] = table[i].value
            }

            data.project_id = $('.project__item.active').attr('data-id')

            $.ajax({
                type: 'POST',
                url: '/getUserTasksDate',
                data
            }).done(msg => {
                const container = $('.user__form-container')
                container.children().remove()
                const $table = $('<table>')


                for (let i = 0; i < msg.length; i++) {
                    $table.append($('<tr>').append([
                        $('<td>').text(msg[i].title),
                        $('<td>').text(msg[i].status === 0 ? 'Не начата' : msg[i].status === 1 ? 'Готово' : 'В работе')
                    ]))
                }
                container.append($table)

            }).fail(err => {
                console.log(err)
            })
        })

        $statisticModal.addClass('active')
        $statisticOverlay.addClass('active')
    })

    $statisticCloseModal.on('click', e => {
        e.preventDefault()
        $statisticModal.removeClass('active')
        $statisticOverlay.removeClass('active')
    })

    $statisticOverlay.on('click', () => {
        $statisticModal.removeClass('active')
        $statisticOverlay.removeClass('active')
    })

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
        console.log('data', data)
        if (data.length !== 0) {
            if (data.progress !== []) {
                for (let i = 0; i < data.progress.length; i++) {
                    $table.append(
                        $('<tr>').append([
                            $('<td>').text(data.progress[i].title),
                            // $('<td>').text(data.progress[i].description),
                            $('<td>').text(dateToString(data.progress[i].time_start)),
                            $('<td>').text(dateToString(data.progress[i].time_end)),
                            $('<td>').text(data.progress[i].name),
                            $('<td>').text(data.progress[i].first_name + ' ' + data.progress[i].last_name),
                            $('<td>').append(
                                $('<button>')
                                .text('Не начата')
                                .attr({
                                    'data-id': data.project_id,
                                    'data-status': data.progress[i].status
                                })
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
                            $('<td>').text(dateToString(data.ready[i].time_start)),
                            $('<td>').text(dateToString(data.ready[i].time_end)),
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
        const button = $(event.target)
        const status = button.attr('data-status')

        let date = new Date()
            .toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            .replace(/[.]/g, '-')
            .split(', ')
            .reverse()

        date[1] = date[1].split('-').reverse().join('-')
        date = date.reverse().join(' ')

        if (status === '0') {
            $.ajax({
                type: 'POST',
                url: '/updateTaskStatus',
                data: {
                    task_id,
                    date
                }
            }).done(msg => {
                button.attr('data-status', '2').addClass('working').text('В работе')
            }).fail(err => {
                console.log(err)
            })

        } else {
            const $row = $(event.currentTarget).parent().parent()

            $.ajax({
                type: 'POST',
                url: '/closeTask',
                data: {
                    task_id,
                    date
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

    }

    // добавление значений в таблицу статистики
    function showStatistic(data) {
        const rows = []
        console.log('data', data)
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                rows.push(
                    $('<tr>').append([
                        $('<td>').text(data[i].first_name + ' ' + data[i].last_name),
                        $('<td>').text(data[i].task_count),
                        $('<td>').text(data[i].status_sum),
                        $('<td>').text(data[i].task_count - data[i].status_sum)
                    ])
                )
            }

            return rows
        }

        return rows
    }

    /**
     * Принимает строку с датой в формате DD-MM-YYYYTHH:MM:SS.000Z
     * @return {String} DD-MM-YYYY HH:MM
     * @param {String} date 
     */
    function dateToString(date) {
        return date.replace('T', ' ').substring(0, 16)
    }
})