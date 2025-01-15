INSERT OR IGNORE INTO language (id, name)
VALUES (1, 'Spanish'),
       (2, 'French'),
       (3, 'Japanese'),
       (4, 'Korean'),
       (5, 'German'),
       (6, 'Italian'),
       (7, 'Hindi'),
       (8, 'Chinese'),
       (9, 'Russian'),
       (10, 'Arabic'),
       (11, 'Portuguese'),
       (12, 'English'),
       (13, 'Turkish'),
       (14, 'Dutch'),
       (15, 'Vietnamese'),
       (16, 'Greek'),
       (17, 'Polish'),
       (18, 'Swedish'),
       (19, 'Latin'),
       (20, 'Irish'),
       (21, 'Norwegian'),
       (22, 'Hebrew'),
       (23, 'Ukrainian'),
       (24, 'Indonesian'),
       (25, 'Finnish'),
       (26, 'Romanian'),
       (27, 'Danish'),
       (28, 'Croatian'),
       (29, 'Czech'),
       (30, 'Hawaiian'),
       (31, 'Zulu'),
       (32, 'Welsh'),
       (33, 'Swahili'),
       (34, 'Hungarian'),
       (35, 'Scottish'),
       (36, 'Haitian'),
       (37, 'Esperanto'),
       (38, 'Navajo'),
       (39, 'Yiddish');

-- password: 123456789
INSERT OR IGNORE INTO user (id, email, full_name, password, verified)
VALUES (100, 'admin@triolingo.space', 'admin', '$2a$10$zc5V1BakWl/0kiU9fRsLxeR0FS.vbPdsIGGG6DOfBJE1ODm3nA1eK', 1);

INSERT OR IGNORE INTO admin(id)
VALUES (100)