import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { Expose } from "class-transformer";
export class RegisterDto {
  @Expose()
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    }
  )
  password!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Please confirm your password" })
  confirmPassword!: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^\+?\d{9,15}$/, { message: "Please enter a valid phone number" })
  phoneNumber!: string;

  // Optional fields
  @Expose()
  @IsString()
  @IsOptional()
  role?: string;

  @Expose()
  @IsString()
  @IsOptional()
  status?: string;

  @Expose()
  @IsString()
  @IsOptional()
  city?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  presently?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  institute_name?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  user_state?: string | null;
}
