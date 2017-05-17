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

//query para obtener un usuario tipo integrante
exports.selectUser = "select id, name, last_name, mail, document from user where document = ? and type_user = 2";
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

//-------------------------------------Members----------------------------------

//query para listar todos los integrantes de los proyectos
exports.listAllMembers = "select m.id as id, p.id as id_project, p.name as project, CONCAT(u.name, ' ', u.last_name) as user, u.document " +
  "from member m join project p on m.project = p.id join user u on m.user = u.id where p.user = ? order by p.name ASC, u.last_name ASC";

//query para listar los miembros de un proyecto
exports.listMemberByProject = "select m.id as id, p.id as id_project, p.name as project, CONCAT(u.name, ' ', u.last_name) as user, u.document " +
  "from member m join project p on m.project = p.id join user u on m.user = u.id where p.user =  ? and p.id = ? order by u.last_name ASC";

//query para seleccionar un integrante
exports.selectMember = "select m.id as id, u.name, u.last_name, u.mail, u.id as id_user, p.user as user, p.id as project " +
  "from member m join user u on m.user = u.id join project p on m.project = p.id where p.user = ? and m.id = ? ";

//query para seleccionar un integrante por documentos
exports.selectMemberByDocument = "select m.id as id, u.name, u.last_name, u.mail, u.id as id_user, p.user as user, p.id as project, p.name as project_name " +
  "from member m join user u on m.user = u.id join project p on m.project = p.id where p.user = ? and u.document = ? and p.id = ?";

//query para eliminar un miembro
exports.deleteMember = "delete from member where id = ?";

//query para inserta un integrante
exports.addMember = "insert into member set ?";

//--------------------------Actividades----------------------------------------

//listar todas las actividades.
exports.listAllActivities = "select a.id, a.name, a.description, DATE_FORMAT(a.start,'%Y-%m-%d') AS start, DATE_FORMAT(a.end,'%Y-%m-%d') AS end, a.project, a.member, p.name as project_name, CONCAT(u.name, ' ', u.last_name) as user_name " +
  "from activity a join project p on a.project = p.id join member m on a.member = m.id join user u on m.user = u.id where p.user = ?";

//listar las actividades de un proyecto
exports.listActivitiesByProject = "select a.id, a.name, a.description, DATE_FORMAT(a.start,'%Y-%m-%d') AS start, DATE_FORMAT(a.end,'%Y-%m-%d') AS end, a.project, a.member, p.name as project_name, CONCAT(u.name, ' ', u.last_name) as user_name " +
  "from activity a join project p on a.project = p.id join member m on a.member = m.id join user u on m.user = u.id where p.user = ? and p.id = ?";

//select activity
exports.selectActivity = "select a.id, a.name, a.description, DATE_FORMAT(a.start,'%Y-%m-%d') AS start, DATE_FORMAT(a.end,'%Y-%m-%d') AS end, a.project, a.member, p.name as project_name, CONCAT(u.name, ' ', u.last_name) as user_name, p.user as user_project " +
  "from activity a join project p on a.project = p.id join member m on a.member = m.id join user u on m.user = u.id where p.user = ? and a.id = ?";

//añadir una nueva actividades
exports.addActivity = "insert into activity set ?";

//eliminar una actividad
exports.deleteActivity = "delete from activity where id = ?";

//editar una actividad
exports.editActivity = "update activity set project = ?, member = ?, name = ?, start = ?, end = ?, description = ? where id = ?";

//---------------------------------------Reuniones-----------------------------

//listar todos los recursos de un director
exports.listAllResources="SELECT r.id, r.name, r.quantity, r.ubication, r.description FROM resources AS r WHERE user=?";
//---------------------------------------Reuniones-----------------------------

//listar todas las reuniones según el usuario logeado
exports.listAllMeeting = "select m.id, m.thematic, m.ubication, DATE_FORMAT(m.start,'%Y-%m-%d') AS start, p.id as id_project, p.name as project_name " +
  "from meeting m join project p on m.project = p.id where p.user = ?";

//listar reuniones por proyecto
exports.listMeetingByProject = "select m.id, m.thematic, m.ubication, DATE_FORMAT(m.start,'%Y-%m-%d') AS start, p.id as id_project, p.name as project_name " +
  "from meeting m join project p on m.project = p.id where p.user = ? and p.id = ?";

//crear una reunión
exports.addMeeting = "insert into meeting set ?";

//obtener una reunión
exports.selectMeeting = "select m.id, m.thematic, m.ubication, DATE_FORMAT(m.start,'%Y-%m-%d') AS start, m.project, p.user as user from meeting m join project p on m.project = p.id where m.id = ?";

//editar una reunión
exports.editMeeting = "update meeting set project = ?, thematic = ?, ubication = ?, start = ? where id = ?";

//eliminar una reunión
exports.deleteMeeting = "delete from meeting where id = ?";
