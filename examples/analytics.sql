-- PostgreSQL example: aggregate daily records without hiding missing source days.
WITH calendar AS (
    SELECT day::date AS metric_day
    FROM generate_series(DATE '2030-01-01', DATE '2030-01-03', INTERVAL '1 day') AS day
), source(metric_day, registrations, attributed) AS (
    VALUES (DATE '2030-01-01', 7, 5), (DATE '2030-01-03', 0, 0)
)
SELECT calendar.metric_day,
       source.registrations,
       source.attributed,
       source.registrations - source.attributed AS unattributed,
       CASE WHEN source.metric_day IS NULL THEN 'missing' ELSE 'available' END AS source_status
FROM calendar
LEFT JOIN source USING (metric_day)
ORDER BY calendar.metric_day;
