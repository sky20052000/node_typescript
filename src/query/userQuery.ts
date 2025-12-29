import {pool} from "../config/db.js"

const Student = {
  createUser: async (data: any) => {
    try {
     return await pool.query(
        `INSERT INTO users (
          email, name, password_hash, role, status, 
          primary_number, date_joined, otp, otp_expiration, 
          city, presently, institute_name, user_state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          data.email,
          data.name,
          data.password,       
          data.role,
          data.status,
          data.primary_number,
          data.date_joined,
          data.otp,
          data.otp_expiration,
          data.city,
          data.presently,
          data.institute_name,
          data.user_state,
        ]
      );

    } catch (err) {
      console.error("Error in createUser:", err);
      throw err; 
    }
  },

  userUsernameOrEmailExists: async (email: string, phoneNumber: string) => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM users WHERE email = $1 OR primary_number = $2",
        [email, phoneNumber]
      );

      return result;
    } catch (err) {
      console.error("Error checking existence:", err);
      throw err;
    }
  },
};

export default Student;

