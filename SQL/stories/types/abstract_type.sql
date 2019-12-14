-- 1 - сначала письмо отправленное пользователем.
-- 2 - письмо из которого были сформированы JSON-LD документы
-- 3 - отвалидированные JSON-LD документы подтвержденные другими людьми
CREATE TYPE STATUS_TYPE AS ENUM (
'draft', -- когда еще не было никуда записано
'untrusted', -- Запись требует обработки. Это когда записано на почту, но не обработано
'soft', -- Когда запись была обработана Core. И запись только кажется верной
'hard', -- Когда запись была обработана сторонними ассистентами и она может быть правдивой
'core' -- Исключительно точная запись, проверенная и валидированная Оракулом
);