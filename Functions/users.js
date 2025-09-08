import userSchema from "../Schemas/user.js";

export const GetUsers = async () => {
  try {
    const users = await userSchema.find();
    return {
      success: true,
      users: users
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const AddUser = async (userData) => {
  try {
    const { name, surname, email, password } = userData;
    const isExistingUser = await userSchema.exists({ email: email });
    if (isExistingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }
    const newUser = new userSchema({
      name,
      surname,
      email,
      password
    });

    await newUser.save();
    return {
      success: true,
      message: "User added successfully",
      user: newUser
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}
