BEGIN;

CREATE SCHEMA demo_reporting;
REVOKE ALL ON SCHEMA demo_reporting FROM PUBLIC;

CREATE TABLE demo_reporting.calendar_day (
    day date PRIMARY KEY
);

CREATE TABLE demo_reporting.completed_load (
    day date PRIMARY KEY REFERENCES demo_reporting.calendar_day (day)
);

CREATE TABLE demo_reporting.registration (
    refcode text PRIMARY KEY CHECK (btrim(refcode) <> ''),
    day date NOT NULL REFERENCES demo_reporting.completed_load (day),
    attributed boolean NOT NULL
);

CREATE INDEX registration_day_idx ON demo_reporting.registration (day);

-- Load the completion marker and its registration rows in the same transaction.
CREATE VIEW demo_reporting.daily_registration AS
SELECT calendar.day,
       CASE WHEN completed.day IS NULL THEN 'missing' ELSE 'loaded' END AS status,
       CASE WHEN completed.day IS NOT NULL THEN count(registration.refcode) END AS total,
       CASE WHEN completed.day IS NOT NULL
           THEN count(*) FILTER (WHERE registration.attributed) END AS matched,
       CASE WHEN completed.day IS NOT NULL
           THEN count(*) FILTER (WHERE NOT registration.attributed) END AS unattributed
FROM demo_reporting.calendar_day AS calendar
LEFT JOIN demo_reporting.completed_load AS completed ON completed.day = calendar.day
LEFT JOIN demo_reporting.registration AS registration ON registration.day = completed.day
GROUP BY calendar.day, completed.day;

COMMIT;
