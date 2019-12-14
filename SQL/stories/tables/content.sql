CREATE TABLE IF NOT EXISTS story.content (
id BIGSERIAL,

message_id UUID NOT NULL,
content BYTEA NOT NULL, -- здесь находится первоначальный текст/фото/видео сообщения
content_type VARCHAR(20) NOT NULL CHECK (content_type <> ''), -- mime тип raw сообщения
email_message_id TEXT CONSTRAINT must_be_different UNIQUE NOT NULL, -- сообщение почты
telegram_message_id BIGINT UNIQUE DEFAULT NULL, -- сообщение телеграмма
--uid INT, -- UID письма может повторяться, предусмотреть это. todo Вообще это можно удалять, нигде не использую
created_at TIMESTAMP NOT NULL,
status STATUS_TYPE NOT NULL DEFAULT 'draft',-- тип записи от неточного к точному

PRIMARY KEY (id)
);

CREATE INDEX ON story.content (content_type);

GRANT ALL PRIVILEGES ON story.content TO bot;
