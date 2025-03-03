-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 03, 2025 at 08:25 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `next_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `campaign`
--

CREATE TABLE `campaign` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `respond` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `campaign_img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_imgpush` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `topicId` int DEFAULT NULL,
  `detailsbirthdate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'false',
  `detailsname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'false',
  `detailstext` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'false',
  `detailswish` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign`
--

-- --------------------------------------------------------

--
-- Table structure for table `campaign_transactions`
--

CREATE TABLE `campaign_transactions` (
  `id` int NOT NULL,
  `campaignsname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lineId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lineName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `form` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthdate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthmonth` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthyear` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthtime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthconstellation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailsbirthage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailstext` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notify` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `campaignsid` int DEFAULT NULL,
  `slip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionID` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailswish` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_transactions`
--

-- --------------------------------------------------------

--
-- Table structure for table `line_users`
--

CREATE TABLE `line_users` (
  `id` int NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `picture_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `line_users`
--

INSERT INTO `line_users` (`id`, `user_id`, `display_name`, `picture_url`, `createdAt`, `updatedAt`) VALUES
(1, 'U2eeb126bb000360fdd5cc0fa950623a9', 'พีรวิชญ์♎🕉️', '', '2025-03-02 11:15:50.000', '2025-03-02 11:15:50.000');

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `topic`
--


-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lineuid` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `lineuid`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('1', 'admin@example.com', 'admin@example.com', NULL, '$2a$12$HNoWVjQWSlTaSEu8R2tXbe4gnIdJiAv5fEryYHJW4Dko/kvwPL3Eu', 'admin', '2025-02-28 10:11:04.000', '2025-02-28 10:11:04.000'),
('cda2e1f0-2b71-46ec-8a09-33fe470ca7fa', 'admin', 'admin2@example.com', NULL, '$2b$12$peAVD4acWppPe0WAA.LPmeZaeiZw2fEhYXuO0yMnjmlywnvMsEE2W', 'admin', '2025-03-03 03:54:13.951', '2025-03-03 04:04:01.236');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Campaign_topicId_fkey` (`topicId`);

--
-- Indexes for table `campaign_transactions`
--
ALTER TABLE `campaign_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Campaign_transactions_campaignsid_fkey` (`campaignsid`);

--
-- Indexes for table `line_users`
--
ALTER TABLE `line_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_lineuid_key` (`lineuid`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `campaign`
--
ALTER TABLE `campaign`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `campaign_transactions`
--
ALTER TABLE `campaign_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `line_users`
--
ALTER TABLE `line_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `campaign`
--
ALTER TABLE `campaign`
  ADD CONSTRAINT `Campaign_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `campaign_transactions`
--
ALTER TABLE `campaign_transactions`
  ADD CONSTRAINT `Campaign_transactions_campaignsid_fkey` FOREIGN KEY (`campaignsid`) REFERENCES `campaign` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
