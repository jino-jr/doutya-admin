-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 29, 2024 at 01:31 AM
-- Server version: 8.0.39
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `persanalytics_doutya`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_text` text NOT NULL,
  `answer` enum('no','yes') NOT NULL,
  `task_marks` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `challenge_id` int NOT NULL,
  `page_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `challenge_type` enum('ordered','unordered') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `frequency` enum('challenges','daily','bootcamp','contest','treasure','referral','streak','refer','quiz','food','experience') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_time` time NOT NULL,
  `end_date` datetime NOT NULL,
  `end_time` time NOT NULL,
  `entry_points` int NOT NULL,
  `reward_points` int NOT NULL,
  `level` int NOT NULL DEFAULT '1',
  `created_by` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `participants_count` int NOT NULL DEFAULT '0',
  `removed_date` datetime DEFAULT NULL,
  `removed_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `arena` enum('no','yes') NOT NULL,
  `district_id` int DEFAULT NULL,
  `visit` enum('no','yes') NOT NULL,
  `active` enum('no','yes') NOT NULL,
  `days` int NOT NULL DEFAULT '0',
  `referral_count` int NOT NULL DEFAULT '0',
  `open_for` enum('everyone','location','specific') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `like_based` enum('no','yes') NOT NULL,
  `live` enum('no','yes') NOT NULL,
  `questions` int NOT NULL DEFAULT '0',
  `exp_type` enum('biriyani','arts','breakfast','entertainment') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rewards` enum('no','yes') NOT NULL,
  `dep_id` int DEFAULT NULL,
  `page_type` enum('job','internship','tests','language','compatibility') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rounds` int NOT NULL,
  `start_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `challenge_media`
--

CREATE TABLE `challenge_media` (
  `media_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `media_type` enum('photo','video') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `media_path` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `compatibility_checker`
--

CREATE TABLE `compatibility_checker` (
  `id` int NOT NULL,
  `page_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `excellent` decimal(10,2) NOT NULL,
  `good` decimal(10,2) NOT NULL,
  `moderate` decimal(10,2) NOT NULL,
  `low` decimal(10,2) NOT NULL,
  `poor` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `keywords`
--

CREATE TABLE `keywords` (
  `id` int NOT NULL,
  `keyword` varchar(150) NOT NULL,
  `is_public` enum('no','yes') NOT NULL,
  `image` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `keyword_level`
--

CREATE TABLE `keyword_level` (
  `id` int NOT NULL,
  `from_mark` int NOT NULL,
  `to_mark` int NOT NULL,
  `level` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE `page` (
  `id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `icon` varchar(150) NOT NULL,
  `banner` varchar(150) NOT NULL,
  `active` enum('yes','no') NOT NULL,
  `followers` int NOT NULL DEFAULT '0',
  `type` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `super_admin` enum('no','yes') NOT NULL,
  `email` varchar(150) NOT NULL,
  `slug` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `poison`
--

CREATE TABLE `poison` (
  `id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `question_id` int NOT NULL,
  `user_id` int NOT NULL,
  `task_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `type` enum('text','audio','video','image') NOT NULL,
  `timer` int NOT NULL,
  `video` varchar(150) DEFAULT NULL,
  `audio` varchar(150) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
  `question` text NOT NULL,
  `challenge_id` int NOT NULL,
  `task_id` int NOT NULL,
  `option` enum('normal','poison','bonus') NOT NULL,
  `stars` int NOT NULL DEFAULT '0',
  `quiz_type` enum('least','most') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_progress`
--

CREATE TABLE `quiz_progress` (
  `id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_id` int NOT NULL,
  `user_id` int NOT NULL,
  `marks` decimal(10,3) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `challenge_id` int NOT NULL,
  `task_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `task_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime NOT NULL,
  `start_time` time NOT NULL,
  `end_date` datetime NOT NULL,
  `end_time` time NOT NULL,
  `task_type` varchar(100) NOT NULL,
  `verification_method` varchar(15) NOT NULL,
  `entry_points` int NOT NULL,
  `reward_points` int NOT NULL,
  `reward_cash` int NOT NULL,
  `verification_points` int NOT NULL,
  `is_certificate` varchar(15) NOT NULL,
  `is_badge` varchar(15) NOT NULL,
  `player_level` varchar(15) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `participants_count` int NOT NULL,
  `active` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `removed_date` datetime DEFAULT NULL,
  `removed_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `day` int NOT NULL DEFAULT '0',
  `win_mark` int NOT NULL,
  `quiz_type` enum('normal','psychological') NOT NULL,
  `task_percent` int NOT NULL DEFAULT '0',
  `task_variety` enum('technical','aptitude') NOT NULL,
  `live` enum('no','yes') NOT NULL,
  `rank` int NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_domains`
--

CREATE TABLE `task_domains` (
  `id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `task_id` int DEFAULT NULL,
  `keyword_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_keywords`
--

CREATE TABLE `task_keywords` (
  `id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `task_id` int NOT NULL,
  `keyword_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_media`
--

CREATE TABLE `task_media` (
  `media_id` int NOT NULL,
  `task_id` int NOT NULL,
  `media_type` enum('photo','video') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `media_path` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_relation`
--

CREATE TABLE `task_relation` (
  `relation_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `task_id` int NOT NULL,
  `order_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `temp_leader`
--

CREATE TABLE `temp_leader` (
  `id` int NOT NULL,
  `marks` decimal(10,3) NOT NULL,
  `user_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `task_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_challenges`
--

CREATE TABLE `user_challenges` (
  `id` int NOT NULL,
  `challenge_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',
  `end_date` datetime DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reward_points` int NOT NULL,
  `arena` enum('no','yes') NOT NULL,
  `page_id` int NOT NULL,
  `completed` enum('no','yes') NOT NULL,
  `visit` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `gender` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `country` int DEFAULT NULL,
  `state` int DEFAULT NULL,
  `firebase_token` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `steps` int NOT NULL DEFAULT '1',
  `followers` int NOT NULL DEFAULT '0',
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `achievement` int NOT NULL DEFAULT '5',
  `referral_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referral_count` int NOT NULL DEFAULT '0',
  `password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_status` enum('public','private') NOT NULL,
  `education` varchar(200) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `resume` varchar(200) DEFAULT NULL,
  `student` enum('no','yes') NOT NULL,
  `college` text,
  `university` text,
  `yearOfPassing` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `monthOfPassing` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_pages`
--

CREATE TABLE `user_pages` (
  `id` int NOT NULL,
  `page_id` int NOT NULL,
  `type` varchar(150) NOT NULL,
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `reward_points` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_tasks`
--

CREATE TABLE `user_tasks` (
  `id` int NOT NULL,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reward_points` int DEFAULT '0',
  `approved` enum('nill','yes','no') NOT NULL,
  `entry_points` int NOT NULL DEFAULT '0',
  `rejected` enum('no','yes') NOT NULL,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_time` time DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `steps` int DEFAULT '0',
  `approved_by` varchar(100) DEFAULT NULL,
  `completed` enum('no','yes') NOT NULL,
  `arena` enum('no','yes') NOT NULL,
  `challenge_id` int NOT NULL,
  `image` varchar(150) DEFAULT NULL,
  `video` varchar(150) DEFAULT NULL,
  `day` int NOT NULL DEFAULT '0',
  `started` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`challenge_id`);

--
-- Indexes for table `challenge_media`
--
ALTER TABLE `challenge_media`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `compatibility_checker`
--
ALTER TABLE `compatibility_checker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `keywords`
--
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `keyword_level`
--
ALTER TABLE `keyword_level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `poison`
--
ALTER TABLE `poison`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_progress`
--
ALTER TABLE `quiz_progress`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`);

--
-- Indexes for table `task_domains`
--
ALTER TABLE `task_domains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_keywords`
--
ALTER TABLE `task_keywords`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_media`
--
ALTER TABLE `task_media`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `task_relation`
--
ALTER TABLE `task_relation`
  ADD PRIMARY KEY (`relation_id`);

--
-- Indexes for table `temp_leader`
--
ALTER TABLE `temp_leader`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_challenges`
--
ALTER TABLE `user_challenges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_pages`
--
ALTER TABLE `user_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_tasks`
--
ALTER TABLE `user_tasks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `challenges`
--
ALTER TABLE `challenges`
  MODIFY `challenge_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `challenge_media`
--
ALTER TABLE `challenge_media`
  MODIFY `media_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compatibility_checker`
--
ALTER TABLE `compatibility_checker`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `keywords`
--
ALTER TABLE `keywords`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `keyword_level`
--
ALTER TABLE `keyword_level`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `page`
--
ALTER TABLE `page`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `poison`
--
ALTER TABLE `poison`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_progress`
--
ALTER TABLE `quiz_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_domains`
--
ALTER TABLE `task_domains`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_keywords`
--
ALTER TABLE `task_keywords`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_media`
--
ALTER TABLE `task_media`
  MODIFY `media_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_relation`
--
ALTER TABLE `task_relation`
  MODIFY `relation_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `temp_leader`
--
ALTER TABLE `temp_leader`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_challenges`
--
ALTER TABLE `user_challenges`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_pages`
--
ALTER TABLE `user_pages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_tasks`
--
ALTER TABLE `user_tasks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
