import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { ResultStatus } from "@prisma/client";
import { groupAndComputeCgpaHistory } from "./result.controller.js";

/**
 * @route GET /student/profile
 * @description Get student profile
 * @access private (student only)
 */
export const getStudentProfile = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      gender: true,
      departmentId: true,
      department: { select: { name: true } },
      createdAt: true,
      updatedAt: true,
      student: {
        select: {
          id: true,
          rollNumber: true,
          branch: true,
          semester: true,
          admissionYear: true,
          isHostelite: true,
          cgpa: true,
        },
      },
    },
  });

  if (!student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Student profile fetched successfully", student)
    );
});

/**
 * @route GET /student/results
 * @description Get logged-in student's results grouped by semester
 * @access private (student only)
 */
export const getMyResults = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const studentRecord = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, cgpa: true },
  });

  if (!studentRecord) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const results = await prisma.result.findMany({
    where: { studentId: studentRecord.id },
    select: {
      resultId: true,
      semester: true,
      marks: true,
      grade: true,
      status: true,
      subject: {
        select: {
          subjectName: true,
          subjectCode: true,
          credits: true,
        },
      },
    },
    orderBy: { semester: "asc" },
  });

  const grouped = groupAndComputeCgpaHistory(results);

  return res.status(200).json(
    new ApiResponse(200, "Results fetched successfully", {
      cgpa: studentRecord.cgpa,
      cgpaHistory: grouped.cgpaHistory,
      semesters: grouped.semesters,
    })
  );
});

/**
 * @route GET /student/subjects
 * @description Get logged-in student's enrolled subjects
 * @access private (student only)
 */
export const getMySubjects = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const student = await prisma.student.findUnique({
    where: { userId },
    select: {
      subjects: {
        select: {
          id: true,
          subjectName: true,
          subjectCode: true,
          credits: true,
          semester: true,
        },
      },
    },
  });

  if (!student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, "Subjects fetched successfully", {
      subjects: student.subjects,
      totalSubjects: student.subjects.length,
    })
  );
});

/**
 * @route GET /student/attendance
 * @description Get logged-in student's subject-wise attendance
 * @access private (student only)
 */
export const getMyAttendance = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.id },
    select: {
      id: true,
      percentage: true,
      subject: {
        select: {
          subjectName: true,
          subjectCode: true,
          credits: true,
          semester: true,
        },
      },
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Attendance fetched successfully", {
      attendance,
      totalSubjects: attendance.length,
    })
  );
});

/**
 * @route GET /student/placements
 * @description Get companies student is eligible for based on CGPA
 * @access private (student only)
 */
export const getEligiblePlacements = AsyncHandler(
  async (req: any, res: any) => {
    const userId = req.user.id;

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { cgpa: true },
    });

    if (!student) {
      return res.status(404).json(new ApiError(404, "Student not found"));
    }

    const eligibleCompanies = await prisma.company.findMany({
      where: {
        eligibilityCgpa: { lte: student.cgpa }, // cgpa >= eligibility threshold
        visitDate: { gte: new Date() }, // only upcoming drives
      },
      orderBy: { visitDate: "asc" },
    });

    return res.status(200).json(
      new ApiResponse(200, "Eligible placements fetched successfully", {
        cgpa: student.cgpa,
        totalEligible: eligibleCompanies.length,
        companies: eligibleCompanies,
      })
    );
  }
);

/**
 * @route GET /student/dashboard
 * @description Get all data needed for student dashboard in one call
 * @access private (student only)
 */
export const getStudentDashboard = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      avatarUrl: true,
      department: { select: { name: true } },
      student: {
        select: {
          id: true,
          rollNumber: true,
          semester: true,
          branch: true,
          cgpa: true,
          subjects: {
            select: { id: true }, // just count
          },
        },
      },
    },
  });

  if (!user?.student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const studentId = user.student.id;

  // Latest semester results summary (last semester they have results for)
  const latestSemResults = await prisma.result.findMany({
    where: { studentId },
    select: {
      marks: true,
      grade: true,
      status: true,
      semester: true,
      subject: {
        select: { subjectName: true, subjectCode: true, credits: true },
      },
    },
    orderBy: { semester: "desc" },
  });

  // Get latest semester number from results
  const latestSemester = latestSemResults[0]?.semester ?? null;
  const latestSemSubjects = latestSemResults.filter(
    (r) => r.semester === latestSemester
  );

  // Compute latest SGPA
  let latestSgpa = null;
  if (latestSemSubjects.length > 0) {
    const totalWeighted = latestSemSubjects.reduce(
      (sum, r) => sum + r.marks * r.subject.credits,
      0
    );
    const totalCredits = latestSemSubjects.reduce(
      (sum, r) => sum + r.subject.credits,
      0
    );
    latestSgpa = parseFloat((totalWeighted / totalCredits).toFixed(2));
  }

  // Eligible placement companies count
  const eligibleCompaniesCount = await prisma.company.count({
    where: {
      eligibilityCgpa: { lte: user.student.cgpa },
      visitDate: { gte: new Date() },
    },
  });

  // Backlogs count (all time)
  const backlogsCount = await prisma.result.count({
    where: { studentId, status: ResultStatus.FAILED },
  });

  return res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched successfully", {
      student: {
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        rollNumber: user.student.rollNumber,
        semester: user.student.semester,
        branch: user.student.branch,
        department: user.department.name,
        cgpa: user.student.cgpa,
      },
      stats: {
        cgpa: user.student.cgpa,
        semester: user.student.semester,
        activeSubjects: user.student.subjects.length,
        eligibleCompanies: eligibleCompaniesCount,
        backlogs: backlogsCount,
      },
      latestSemesterSummary: {
        semester: latestSemester,
        sgpa: latestSgpa,
        subjects: latestSemSubjects.map((r) => ({
          subjectName: r.subject.subjectName,
          subjectCode: r.subject.subjectCode,
          credits: r.subject.credits,
          marks: r.marks,
          grade: r.grade,
          status: r.status,
        })),
      },
    })
  );
});
