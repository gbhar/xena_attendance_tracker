SET SCHEMA 'student_userName';
CREATE OR REPLACE VIEW completedtraining AS
 SELECT name, ntid
 FROM trainee
 WHERE labstatus=192;
GRANT SELECT ON TABLE completedtraining TO "xenaTrainingDBStudent";
