import { prisma } from "../lib/prisma.js";

export const generateRollno = async (gender: string) => {
  const prefix = new Date().getFullYear();
  const middle = gender === "MALE" ? 56 : 57;
  let suffix = "1";
  const lastStudent = await prisma.student.findFirst({
    where: {
      rollNumber: parseInt(`${prefix}`),
    },
    orderBy: { rollNumber: "desc" },
  });
  if (lastStudent) {
    const lastSerial = lastStudent?.rollNumber.toString().slice(-3);
    const nextSerial = parseInt(lastSerial) + 1;
    suffix = nextSerial.toString().padStart(3, "0");
  } else {
    suffix = suffix.toString().padStart(3, "0");
  }
  const rollno = `${prefix}${middle}${suffix}`;
  return parseInt(rollno);
};
