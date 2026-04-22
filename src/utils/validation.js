const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateProfileEditData = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "email",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_EDIT_FIELDS.includes(field),
  );
  //const { age, gender, skills, photoUrl } = req.body;
  // if (!validator.isNumeric(age) && age < 18) {
  //   throw new Error("Invalid age!");
  // } else if(!["male", "female", "others"].includes(gender)){
  //   throw new Error("Invalid gender!");
  // } else if(validator.isURL(photoUrl))
  return isEditAllowed;
};

const validatePassword = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

module.exports = {
  validateSignupData,
  validateProfileEditData,
  validatePassword,
};
