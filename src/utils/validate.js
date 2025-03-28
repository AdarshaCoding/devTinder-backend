const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter the correct name!");
  }
  // we can handle all the fields as well
  //Email, password, age and gender have been handled in User model
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "age",
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "about",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignupData, validateProfileEditData };
