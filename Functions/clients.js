import Users from "../Schemas/user.js";

export const AddClient = async (userId, clientData) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.clients.push(clientData);
    await user.save();
    return {
      success: true,
      message: "Client added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while adding the client",
    };
  }
};
