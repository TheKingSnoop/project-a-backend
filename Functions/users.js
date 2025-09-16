import Users from "../Schemas/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const GetUsers = async () => {
  try {
    const users = await Users.find();
    return {
      success: true,
      payload: users
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const Login = async (loginData) => {
  try {
    const { email, password } = loginData;
    const user = await Users.findOne({ email: email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    if (user && bcrypt.compareSync(password, user.password) === false) {
      return {
        success: false,
        message: "Incorrect password",
      };
    } else {
       const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return {
        success: true,
        message: "Login successful",
        token: token,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export const AddUser = async (userData) => {
  try {
    const { name, surname, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExistingUser = await Users.exists({ email: email });
    if (isExistingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }
    const newUser = new Users({
      name,
      surname,
      email,
      password: hashedPassword
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
