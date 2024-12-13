import jwt, { JwtPayload } from "jsonwebtoken";


interface UserJwtPayload extends JwtPayload {
  userID: string;
  role?: string;
}

export const verifyUser = async (event: any) => {
  try {
    const token = event.headers.Authorization?.split(" ")[1] || event.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Authorization token is missing. Please provide a valid token to access this resource.");
    }

    const secret = process.env.JWT_SECRET || "defaultSecret"; 
    const decoded = jwt.verify(token, secret) as UserJwtPayload;

    console.log("Decoded token:", decoded);

    // Kontrollera om användaren har en specifik roll (om det krävs, annars ta bort detta block)
    if (decoded.role && decoded.role !== "user") {
      throw new Error("Not authorized for this resource");
    }


    return { isValid: true, userID: decoded.userID, role: decoded.role };
  } catch (error) {
    console.error("Authorization error:", (error as Error).message);
    return { isValid: false, message: (error as Error).message };
  }
};
