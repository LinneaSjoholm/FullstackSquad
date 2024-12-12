import jwt, { JwtPayload } from "jsonwebtoken";

// Definiera en anpassad typ för vår JWT-payload
interface AdminJwtPayload extends JwtPayload {
  adminID: string;
  role: string;
}
  
  export const verifyAdmin = async (event: any) => {
    try {
      const token = event.headers.Authorization?.split(" ")[1] || event.headers.authorization?.split(" ")[1];
  
      if (!token) {
        throw new Error("Authorization token is missing. Please provide a valid token to access this resource.");
      }
  
      const secret = process.env.JWT_SECRET || "defaultSecret";
      const decoded = jwt.verify(token, secret) as AdminJwtPayload;
  
      if (decoded.role !== "admin") {
        throw new Error("Not authorized as admin");
      }
  
      // Om allt är OK, returnera ett objekt med isValid och decoded admin info
      return { isValid: true, adminID: decoded.adminID };
    } catch (error) {
      console.error("Authorization error:", (error as Error).message);
      return { isValid: false, message: (error as Error).message };
    }
  };
