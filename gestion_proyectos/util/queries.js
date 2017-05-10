//Documento para centralizar las consultas sql del sistema

//query para listar los tipo de documentos del sistema.
exports.listTypeDocuments = "select id, type from type_document";

//query para listar los tipos de ususarios del sistema.
exports.listTypeUsers = "select id, description from type_user";

//query para realizar el insert de un nuevo registro de usuario en la bd
exports.insertUser = "insert into user set ?";

//query para realizar el login
exports.login = "select u.id as id, u.document, u.name, u.last_name, u.date, u.type_user, u.type_document, u.mail, t.description as rol,IF(u.type_user=1,true,false) as state" +
  " from user u join type_user t on u.type_user=t.id where mail = ? and password = ?";

//-----------------------------------Project------------------------------------

//query para listar los projectos de un usuario.
exports.listProjectByUser = "SELECT id, user, name, DATE_FORMAT(START,'%Y-%m-%d') AS start," +
  " DATE_FORMAT(END,'%Y-%m-%d') AS end, stage FROM project where user = ?";

//query para crear un proyecto
exports.createProject = "insert into project set ?";

//query para obtener un proyectos
exports.selectProject = "select id, user, name, DATE_FORMAT(START,'%Y-%m-%d') AS start," +
  "DATE_FORMAT(END,'%Y-%m-%d') AS end, stage from project where id = ?";

//query para actualizar un projecto
exports.editProject = "update project set name = ?, start = ?, end = ?, stage = ? " +
  "where id = ? and user = ?";

//query para eliminar un projecto
exports.deleteProject = "delete from project where user = ? and id = ?"

//-----------------------------------Cargos-------------------------------------

//query para listar todos los cargos que a creado un director
exports.listPositionByUser = "SELECT c.id, c.name, c.project, p.name AS project_name," +
  " c.description, c.schedule, c.salary FROM POSITION c JOIN project p ON c.project = p.id " +
  "WHERE p.user = ?";

//query para listar los cargos creados para un proyecto
exports.listPositionByProject = "SELECT c.id, c.name, c.project, p.name AS project_name," +
  " c.description, c.schedule, c.salary FROM POSITION c JOIN project p ON c.project = p.id " +
  "WHERE p.user = ? and c.project = ?";

//query para realizar el insert de un cargo
exports.crearPosition = "insert into position set ?";

//seleccionar un cargo
exports.selectCharge = "SELECT c.id, c.name, c.project, p.name AS project_name," +
  " c.description, c.schedule, c.salary, p.user as user FROM POSITION c JOIN project p ON c.project = p.id " +
  "WHERE p.user = ? and c.id = ?";

//eliminar un cargo
exports.deleteCharge = "delete from position where id = ?";

//editar un cargo
exports.editPosition = "update position set name = ?, project = ?, schedule = ?, salary = ?, description = ?" +
  " where id = ?";
