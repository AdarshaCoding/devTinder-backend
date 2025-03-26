const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter the correct name!");
  }
  // we can handle all the fields as well
  //Email, password, age and gender have been handled in User model
};

module.exports = { validateSignupData };
