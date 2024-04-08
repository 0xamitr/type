-- Queries Used through out the development process

--Creating users table, general schema pattern

CREATE TABLE IF NOT EXISTS `users`(
        `id` INT(4) NOT NULL AUTO_INCREMENT,
        `username` VARCHAR(20) NOT NULL,
        `password` VARCHAR(80) NOT NULL,
        `email` VARCHAR(50) NOT NULL,
        `text_tests` INT DEFAULT 0,
        `text_tests_today` INT DEFAULT 0,
        `code_tests` INT DEFAULT 0,
        `code_tests_today` INT DEFAULT 0,
        `cumm_code_accuracy_today` INT DEFAULT 0,
        `cumm_text_accuracy_today` INT DEFAULT 0,
        `cumm_code_accuracy` INT DEFAULT 0,
        `cumm_text_accuracy` INT DEFAULT 0,
        `cumm_code_wpm` INT DEFAULT 0,
        `cumm_text_wpm` INT DEFAULT 0,
        `cumm_code_wpm_today` INT DEFAULT 0,
        `cumm_text_wpm_today` INT DEFAULT 0,
        `highest_text_wpm_ever` INT DEFAULT 0,
        `highest_text_wpm_today` INT DEFAULT 0,
        `highest_text_accuracy_today` INT DEFAULT 0,
        `highest_code_wpm_ever` INT DEFAULT 0,
        `highest_code_wpm_today` INT DEFAULT 0,
        `highest_code_accuracy_today` INT DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE (username),
        UNIQUE (email)
);