-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 04 2020 г., 20:41
-- Версия сервера: 10.4.11-MariaDB
-- Версия PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `order`
--

-- --------------------------------------------------------

--
-- Структура таблицы `profession`
--

CREATE TABLE `profession` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `profession`
--

INSERT INTO `profession` (`id`, `name`) VALUES
(1, 'Дизайнер'),
(2, 'Front-end'),
(3, 'Back-end'),
(4, 'Администратор'),
(5, 'Маркетолог');

-- --------------------------------------------------------

--
-- Структура таблицы `projects`
--

CREATE TABLE `projects` (
  `id` int(6) NOT NULL,
  `pic` varchar(10) NOT NULL,
  `title` varchar(30) NOT NULL,
  `time_start` datetime NOT NULL,
  `time_end` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `pic`, `title`, `time_start`, `time_end`, `status`) VALUES
(1, '#0cecdd', 'Сбербанк', '2020-06-07 10:00:10', '2020-06-13 11:00:11', 0),
(2, '#459922', 'Альфа Банк', '2020-06-03 11:12:13', '2020-06-16 12:13:14', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(6) NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` varchar(250) NOT NULL,
  `time_start` datetime NOT NULL,
  `time_end` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `time_start`, `time_end`, `status`, `project_id`, `user_id`) VALUES
(1, 'Главная страница', 'Задизайнить главную страницу\r\nДолжен быть слайдер!!!', '2020-06-06 00:18:52', '2020-06-08 11:00:00', 0, 1, 2),
(2, 'Дизайн шапки', 'Три кнопки:\r\nПрисоединиться, Блог, Главная', '2020-06-06 00:20:28', '2020-06-07 02:00:00', 1, 1, 5),
(3, 'Обработка формы', 'Переделать форму\r\nДобавить параметры name, company', '2020-06-06 09:02:20', '2020-06-08 00:21:32', 0, 1, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(6) NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `prof_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `first_name`, `last_name`, `prof_id`) VALUES
(1, 'admin', 'admin', 'Филипп', 'Князев', 4),
(2, 'user1', 'user1', 'Виталий', 'Козлов', 1),
(3, 'user2', 'user2', 'Герман', 'Некрасов', 3),
(4, 'user3', 'user3', 'Закир', 'Бирюков', 2),
(5, 'user4', 'user4', 'Инга', 'Аксёнова', 1),
(6, 'user5', 'user5', 'Софья', 'Селезнёва', 2),
(7, 'user6', 'user6', 'Лилия', 'Романова', 3);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `profession`
--
ALTER TABLE `profession`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prof_id` (`prof_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `profession`
--
ALTER TABLE `profession`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`prof_id`) REFERENCES `profession` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
