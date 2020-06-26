$(document).ready(function () {

    // кнопка создания проекта
    const $openProject = $('.project__create')
    const $createProject = $('.main__submit')
    const $closeProject = $('.closeProject')
    // кнопка создания задачи
    const $createTask = $('.tasks__submit')

    // модальное окно создания проекта
    const $modal = $('.main__modal')
    const $overlay = $('.main__overlay')
    const $closeModal = $('.js-modal-close')

    // модальное окно при создании задачи
    const $taskModal = $('.tasks__modal')
    const $taskOverlay = $('.tasks__overlay')

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
                url: '/getAllTasksDate',
                data
            }).done(msg => {

                console.log('tasks', msg)
                const container = $('.user__form-container')
                container.children().remove()
                const $table = $('<table>')


                for (let i = 0; i < msg.length; i++) {
                    console.log()
                    $table.append($('<tr>').append([
                        $('<td>').text(msg[i].title),
                        $('<td>').text(msg[i].first_name + ' ' + msg[i].last_name),
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

    $closeProject.on('click', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/closeProject',
            data: {
                project_id: $('.project__item.active').attr('data-id')
            }
        }).done(msg => {
            console.log('close project', msg)
            window.location = '/main'
        }).fail(err => {
            console.log(err)
        })
    })

    $createTask.on('click', function (e) {
        e.preventDefault()

        const form = $(this).parent().serializeArray()
        let data = {}

        for (let key in form) {
            data[form[key].name] = form[key].value
        }

        data.project_id = $('.project__item.active').attr('data-id')

        $.ajax({
            type: 'POST',
            url: '/addTask',
            data
        }).done(msg => {
            $taskModal.removeClass('active')
            $taskOverlay.removeClass('active')
        }).fail(err => {
            console.log(err)
        })

    })

    $createProject.on('click', function (e) {
        e.preventDefault()
        const form = $(this).parent().serializeArray()

        let data = {}

        for (let key in form) {
            data[form[key].name] = form[key].value
        }

        data.pic = getColor()

        $.ajax({
            type: 'POST',
            url: '/addProject',
            data
        }).done(msg => {
            console.log('addproject', msg)
        }).fail(err => {
            console.log(err)
        })

    })

    $openProject.on('click', function (e) {
        e.preventDefault()
        $modal.addClass('active')
        $overlay.addClass('active')
    })

    $closeModal.on('click', e => {
        e.preventDefault()
        $modal.removeClass('active')
        $overlay.removeClass('active')

        $taskModal.removeClass('active')
        $taskOverlay.removeClass('active')
    })

    $overlay.on('click', () => {
        $modal.removeClass('active')
        $overlay.removeClass('active')
    })

    $taskOverlay.on('click', () => {
        $taskModal.removeClass('active')
        $taskOverlay.removeClass('active')
    })

    // инпуты времени проекта
    // const $projectStartTime = $('#projectStartTime')
    // const $projectEndTime = $('#projectEndTime')

    // установка обработчика для всех элементов списков
    $('.project__item').on('click', function (event) {
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
            $('.closeProject').css('display', 'none')
        } else {
            $('.tasks__table').css('display', 'table')
            $('.closeProject').css('display', 'block')
        }

        $('.add')
            .attr('data-id', $item.attr('data-id'))
            .on('click', openTaskAdd)

        const title = $item.children('.project__name').text()
        $('.tasks__title').text(title)

        $.ajax({
            type: 'POST',
            url: '/info',
            data: {
                project_id: $item.attr('data-id')
            }
        }).done(msg => {

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
                            $('<td>').text(dateToString(data.progress[i].time_start)),
                            $('<td>').text(dateToString(data.progress[i].time_end)),
                            $('<td>').text(data.progress[i].name),
                            $('<td>').text(data.progress[i].first_name + ' ' + data.progress[i].last_name),
                            $('<td>').append(
                                $('<button>')
                                .text('Удалить')
                                .attr('data-id', data.project_id)
                                .addClass('del')
                                .on('click', deleteTask.bind(this, data.progress[i].id))
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

    function deleteTask(task_id, event) {
        const $row = $(event.currentTarget).parent().parent()

        $.ajax({
            type: 'POST',
            url: '/deleteTask',
            data: {
                task_id
            }
        }).done(msg => {
            $row.remove()
        }).fail(err => {
            console.log(err)
        })
    }

    function openTaskAdd() {
        event.preventDefault()
        $taskModal.addClass('active')
        $taskOverlay.addClass('active')
        // const $row = $(event.currentTarget).parent().parent()
        // const items = $row.children()

        // for (let i = 0; i < items.length; i++) {
        //     $(items[i]).children()[0].value
        // }
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

    // установка минимального значения времени
    // let date = new Date()
    //     .toLocaleDateString('ru-RU', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit'
    //     })
    //     .replace(/[.]/g, '-')
    //     .split(', ')
    // date[0] = date[0].split('').reverse().join()
    // date = date.join('T')
    // console.log($projectStartTime.attr({ min: date.substring(0, date.length - 3), max: '2021-01-01T00:00:00' }))

    function getColor() {
        return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
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