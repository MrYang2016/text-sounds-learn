-- CreateTable
CREATE TABLE `tts` (
    `id` CHAR(44) NOT NULL,
    `text` TEXT NOT NULL,
    `url` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

