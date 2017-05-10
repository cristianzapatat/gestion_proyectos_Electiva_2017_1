//Documento para centralizar las consultas sql del sistema

//query para listar los tipo de documentos del sistema.
exports.listTypeDocuments = "select id, type from type_document";

//query para listar los tipos de ususarios del sistema.
exports.listTypeUsers = "select id, description from type_user";

//query para realizar el insert de un nuevo registro de usuario en la bd
exports.insertUser = "insert into user set ?";

//query para realizar el login
exports.login = "select id, document, name, last_name, date, type_user, type_document, mail" +
  " from user where mail = ? and password = ?"

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
