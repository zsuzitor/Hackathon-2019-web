const Student = require('../models/student');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

  let errors = [];
  let token = req.headers['x-access-token'];

  // найдем пользователя, у которого данный токен
  jwt.verify(token, constants.SECRET_STRING, function (err, decoded) {
    if (err) {
      errors.push( 'Введен неверный токен, или срок действия токена истек');
      return res.status(403).json({
        errors
      });
    }

    let studentId = decoded.id;

    Student.findById(userId, function (err, user) {
      if (err) throw err;
      if (!user) {
        errors.push('Пользователь с введенным токеном не найден');
        return res.status(403).json({
          errors
        });
      }

      // т.к срок действия старых токенов мог еще не истечь
      if (user.token == token) {
        res.studentId = studentId;
        return next(); 
      } else {
        errors.push('Введен неверный токен, или срок действия токена истек');
        return res.status(403).json({
          errors
        });
      }
    });
  });
}

module.exports = verifyToken;
