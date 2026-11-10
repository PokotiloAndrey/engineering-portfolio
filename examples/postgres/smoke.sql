BEGIN;

INSERT INTO demo_reporting.calendar_day (day)
VALUES ('2030-01-01'), ('2030-01-02'), ('2030-01-03');

INSERT INTO demo_reporting.completed_load (day)
VALUES ('2030-01-01'), ('2030-01-03');

INSERT INTO demo_reporting.registration (refcode, day, attributed)
VALUES ('demo-one', '2030-01-01', true), ('demo-two', '2030-01-01', false);

-- Replaying the same import must leave the daily total unchanged.
INSERT INTO demo_reporting.registration (refcode, day, attributed)
VALUES ('demo-one', '2030-01-01', true)
ON CONFLICT (refcode) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM demo_reporting.daily_registration
        WHERE day = '2030-01-01' AND status = 'loaded'
            AND total = 2 AND matched = 1 AND unattributed = 1
    ) THEN
        RAISE EXCEPTION 'Expected two unique registrations and one attribution';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM demo_reporting.daily_registration
        WHERE day = '2030-01-02' AND status = 'missing'
            AND total IS NULL AND matched IS NULL AND unattributed IS NULL
    ) THEN
        RAISE EXCEPTION 'A missing load must keep its counts null';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM demo_reporting.daily_registration
        WHERE day = '2030-01-03' AND status = 'loaded'
            AND total = 0 AND matched = 0 AND unattributed = 0
    ) THEN
        RAISE EXCEPTION 'A completed empty load must report zero';
    END IF;
END
$$;

TABLE demo_reporting.daily_registration ORDER BY day;

ROLLBACK;
