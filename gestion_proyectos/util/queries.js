//Documento para centralizar las consultas sql del sistema

//query para listar los tipo de documentos del sistema.
exports.listTypeDocuments = "select id, type from type_document";

//query para listar los tipos de ususarios del sistema.
exports.listTypeUsers = "select id, description from type_user";

//query para realizar el insert de un nuevo registro de usuario en la bd
exports.insertUser = "insert into user set ?";

//query para realizar el login
exports.login = "select document, name, last_name, date, type_user, type_document, mail" +
  " from user where mail = ? and password = ?"
