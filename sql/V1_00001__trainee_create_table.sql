GRANT USAGE ON SCHEMA student_userName TO "xenaTrainingDBStudent";

SET SCHEMA 'student_userName';
CREATE TABLE IF NOT EXISTS trainee (
 id SERIAL,
 ntid VARCHAR ( 50 ) NOT NULL,
 name VARCHAR ( 50 ) NOT NULL,
 labstatus INT NOT NULL
);
GRANT SELECT ON TABLE trainee TO "xenaTrainingDBStudent";
