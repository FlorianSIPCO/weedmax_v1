import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sendMail } from "../sendMail";

const prisma = new PrismaClient();

interface UserData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  phoneNumber: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  role?: "ADMIN" | "CLIENT"; // Par défaut, on mettra CLIENT
}

export const createUser = async (userData: UserData) => {
  const { email, password, firstname, lastname, dateOfBirth, phoneNumber, street, city, zipCode, country, role } = userData;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Adresse mail non disponible.");
    }

    // Hash du mot de passe avant de le stocker (NextAuth le gérera aussi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Génération d'un token unique pour l'activation du compte
    const verificationToken = randomUUID();

    // Convertion de dateOfBirth en Date
    const formattedDateOfBirth = dateOfBirth ? new Date(dateOfBirth): null;
    if (!formattedDateOfBirth || isNaN(formattedDateOfBirth.getTime())) {
      throw new Error('Format de date invalide. Utilisez YYYY-MM-DD');
    }
    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        dateOfBirth: formattedDateOfBirth,
        phoneNumber,
        emailVerified: null, // l'email n'est pas encore vérifié
        emailVerificationToken: verificationToken, // Stocke le token pour l'activation
        addresses: {
          create: [
              {
                  street,
                  city,
                  zipCode,
                  country
              }
          ]
        },
        role: role || "CLIENT",
      },
    });

    // URL de validation d'email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

    // Envoi de l'email de confirmation
    await sendMail(
      newUser.email,
      "Validation de votre adresse email",
      `Bonjour ${newUser.firstname}, \n\nMerci de vous être inscrit. Cliquez sur le lien suivant pour valider votre adresse email : \n\n${verificationLink}\n\nSi vous n'êtes pas à l'origine de cette demande, contactez SIPCO et/ou ignorez cet email.`
    )
    
    return newUser;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw new Error("Impossible de créer l'utilisateur");
  }
};

