$(document).ready(function () {
    // кнопка создания проекта
    const $createProject = $('.project__create')
    // инпуты времени проекта
    const $projectStartTime = $('#projectStartTime')
    const $projectEndTime = $('#projectEndTime')

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

    // модальное окно создания проекта
    const $modal = $('.main__modal')
    const $overlay = $('.main__overlay')
    const $closeModal = $('.js-modal-close')

    $createProject.on('click', function (e) {
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

})