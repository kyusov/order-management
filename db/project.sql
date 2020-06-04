-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 01 2020 г., 04:45
-- Версия сервера: 10.4.11-MariaDB
-- Версия PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `project`
--

-- --------------------------------------------------------

--
-- Структура таблицы `prof-user`
--

CREATE TABLE `prof-user` (
  `id` int(11) NOT NULL,
  `prof_id` int(2) NOT NULL,
  `user_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `prof-user`
--

INSERT INTO `prof-user` (`id`, `prof_id`, `user_id`) VALUES
(1, 4, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `professions`
--

CREATE TABLE `professions` (
  `id` int(2) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `professions`
--

INSERT INTO `professions` (`id`, `name`) VALUES
(1, 'Frontend'),
(2, 'Backend'),
(3, 'Designer'),
(4, 'Manager');

-- --------------------------------------------------------

--
-- Структура таблицы `project-task`
--

CREATE TABLE `project-task` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `time_start` datetime NOT NULL,
  `time_end` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `pic` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `title`, `time_start`, `time_end`, `status`, `pic`) VALUES
(42, 'Проект 1', '2020-06-01 00:00:00', '2020-06-05 00:00:00', 0, '#40b0ea'),
(43, 'Проект 2', '2020-06-01 00:00:00', '2020-06-26 00:00:00', 0, '#6fb3a0'),
(44, 'Проект 3', '2020-06-01 00:00:00', '2020-06-11 00:00:00', 0, '#bac2cb');

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(7) NOT NULL,
  `title` varchar(30) NOT NULL,
  `time_start` datetime NOT NULL,
  `time_expected` datetime(1) NOT NULL,
  `type_id` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `time_start`, `time_expected`, `type_id`, `status`, `project_id`) VALUES
(27, 'Backend', '2020-06-01 00:00:00', '2020-06-26 00:00:00.0', 2, 0, 42),
(28, 'Frontend', '2020-06-01 00:00:00', '2020-06-30 00:00:00.0', 1, 0, 42),
(29, 'Design', '2020-06-01 00:00:00', '2020-06-29 00:00:00.0', 3, 0, 43),
(30, 'Backend', '2020-06-01 00:00:00', '2020-06-11 00:00:00.0', 2, 0, 44);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks-executors`
--

CREATE TABLE `tasks-executors` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tasks-executors`
--

INSERT INTO `tasks-executors` (`id`, `task_id`, `user_id`) VALUES
(15, 27, 3),
(16, 28, 2),
(17, 29, 4),
(18, 30, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks-type`
--

CREATE TABLE `tasks-type` (
  `id` int(2) NOT NULL,
  `type` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tasks-type`
--

INSERT INTO `tasks-type` (`id`, `type`) VALUES
(1, 'Frontend'),
(2, 'Backend'),
(3, 'Design');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(16) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1, 'admin@test.com', 'admin', 'Админ', 'Админов'),
(2, 'user1@test.com', '12345', 'Иван', 'Иванов'),
(3, 'user2@test.com', '123456', 'Петр', 'Петров'),
(4, 'user3@test.com', '123456', 'Яков', 'Сидоров');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `prof-user`
--
ALTER TABLE `prof-user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prof_id` (`prof_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `professions`
--
ALTER TABLE `professions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `project-task`
--
ALTER TABLE `project-task`
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
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tasks-executors`
--
ALTER TABLE `tasks-executors`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tasks-type`
--
ALTER TABLE `tasks-type`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `prof-user`
--
ALTER TABLE `prof-user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `professions`
--
ALTER TABLE `professions`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `project-task`
--
ALTER TABLE `project-task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT для таблицы `tasks-executors`
--
ALTER TABLE `tasks-executors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `tasks-type`
--
ALTER TABLE `tasks-type`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `prof-user`
--
ALTER TABLE `prof-user`
  ADD CONSTRAINT `prof-user_ibfk_1` FOREIGN KEY (`prof_id`) REFERENCES `professions` (`id`),
  ADD CONSTRAINT `prof-user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
