import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import * as XLSX from "xlsx";
import { ResultStatus } from "@prisma/client";

/**
 * @route POST /result/upload
 * @description Upload results via CSV/Excel file
 * @access private (admin only)
 */
export const uploadResultsFromFile = AsyncHandler(
  async (req: any, res: any) => {
    // 1. Check file exists
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No file uploaded"));
    }

    // 2. Parse file buffer → rows
    let rows: any[];
    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // take first sheet
      if (!sheetName) {
        return res
          .status(400)
          .json(new ApiError(400, "Workbook has no sheets"));
      }

      const sheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(sheet as XLSX.WorkSheet);
      // converts to array of objects
    } catch (error) {
      return res.status(400).json(new ApiError(400, "Invalid file format"));
    }

    if (!rows || rows.length === 0) {
      return res.status(400).json(new ApiError(400, "File is empty"));
    }

    // 3. Validate required columns exist
    const requiredColumns = ["studentId", "subjectCode", "semester", "marks"];
    const fileColumns = Object.keys(rows[0]);
    const missingColumns = requiredColumns.filter(
      (col) => !fileColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      return res
        .status(400)
        .json(
          new ApiError(400, `Missing columns: ${missingColumns.join(", ")}`)
        );
    }

    // 4. Fetch all subjects by subjectCode in one query (avoid N+1)
    const subjectCodes = [
      ...new Set(rows.map((r) => r.subjectCode)),
    ] as string[];
    const subjects = await prisma.subject.findMany({
      where: { subjectCode: { in: subjectCodes } },
      select: { id: true, subjectCode: true, credits: true },
    });
    const subjectMap = new Map(subjects.map((s) => [s.subjectCode, s]));

    // 5. Fetch all students in one query (avoid N+1)
    const studentIds = [...new Set(rows.map((r) => r.studentId))] as string[];
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: {
        id: true,
        subjects: { select: { id: true } }, // for enrollment check
      },
    });
    const studentMap = new Map(students.map((s) => [s.id, s]));

    // 6. Validate each row and build results array
    const errors: { row: number; reason: string }[] = [];
    const validResults: {
      studentId: string;
      subjectId: string;
      semester: number;
      marks: number;
      grade: string;
      status: ResultStatus; // ← import already exists at top, just use it
    }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header

      const { studentId, subjectCode, semester, marks } = row;

      // Validate marks range
      if (marks < 0 || marks > 100) {
        errors.push({ row: rowNum, reason: `Marks must be between 0 and 100` });
        continue;
      }

      // Validate subject exists
      const subject = subjectMap.get(subjectCode);
      if (!subject) {
        errors.push({
          row: rowNum,
          reason: `Subject '${subjectCode}' not found`,
        });
        continue;
      }

      // Validate student exists
      const student = studentMap.get(studentId);
      if (!student) {
        errors.push({
          row: rowNum,
          reason: `Student '${studentId}' not found`,
        });
        continue;
      }

      // Validate student is enrolled in subject
      const isEnrolled = student.subjects.some((s) => s.id === subject.id);
      if (!isEnrolled) {
        errors.push({
          row: rowNum,
          reason: `Student '${studentId}' is not enrolled in '${subjectCode}'`,
        });
        continue;
      }

      validResults.push({
        studentId,
        subjectId: subject.id,
        semester: parseInt(semester),
        marks: parseFloat(marks),
        grade: computeGrade(parseFloat(marks)),
        status:
          parseFloat(marks) >= 40 ? ResultStatus.PASS : ResultStatus.FAILED,
      });
    }

    // 7. If ALL rows failed validation, don't insert anything
    if (validResults.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "No valid results to upload"));
    }

    // 8. Bulk insert in a transaction + skip duplicates
    let insertedCount = 0;
    let skippedCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const result of validResults) {
        // upsert so re-uploading same file doesn't break
        const existing = await tx.result.findUnique({
          where: {
            studentId_subjectId_semester: {
              studentId: result.studentId,
              subjectId: result.subjectId,
              semester: result.semester,
            },
          },
        });

        if (existing) {
          skippedCount++;
          continue; // skip duplicate
        }

        await tx.result.create({ data: result });
        insertedCount++;
      }
    });

    // 9. Recompute CGPA for all affected students (outside transaction)
    const affectedStudentIds = [
      ...new Set(validResults.map((r) => r.studentId)),
    ];
    await Promise.all(
      affectedStudentIds.map((id) => recomputeAndUpdateCgpa(id))
    );

    return res.status(201).json(
      new ApiResponse(201, "Results uploaded successfully", {
        totalRows: rows.length,
        inserted: insertedCount,
        skipped: skippedCount, // duplicates
        failed: errors.length, // validation failures
        errors, // so admin knows which rows failed and why
      })
    );
  }
);

/**
 * @route GET /result/student/:studentId
 * @description Get all results of a student grouped by semester with SGPA/CGPA history
 * @access private (admin only) — student uses /student/results
 */
export const getResultsByStudentId = AsyncHandler(
  async (req: any, res: any) => {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json(new ApiError(400, "Student ID is required"));
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return res.status(404).json(new ApiError(404, "Student not found"));
    }

    const results = await prisma.result.findMany({
      where: { studentId },
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
        studentId,
        cgpa: student.cgpa,
        cgpaHistory: grouped.cgpaHistory,
        semesters: grouped.semesters,
      })
    );
  }
);

/**
 * @route PATCH /result/:resultId
 * @description Update a result (marks correction)
 * @access private (admin only)
 */
export const updateResultById = AsyncHandler(async (req: any, res: any) => {
  const { resultId } = req.params;
  const { marks } = req.body;

  if (!resultId) {
    return res.status(400).json(new ApiError(400, "Result ID is required"));
  }

  if (marks === undefined) {
    return res.status(400).json(new ApiError(400, "Marks are required"));
  }

  const result = await prisma.result.findUnique({
    where: { resultId },
  });
  if (!result) {
    return res.status(404).json(new ApiError(404, "Result not found"));
  }

  // Recompute grade and status from new marks
  const grade = computeGrade(marks);
  const status = marks >= 40 ? ResultStatus.PASS : ResultStatus.FAILED;
  const updatedResult = await prisma.result.update({
    where: { resultId },
    data: { marks, grade, status },
  });

  // Recompute CGPA since marks changed
  await recomputeAndUpdateCgpa(result.studentId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Result updated successfully", updatedResult));
});

/**
 * @route DELETE /result/:resultId
 * @description Delete a result
 * @access private (admin only)
 */
export const deleteResultById = AsyncHandler(async (req: any, res: any) => {
  const { resultId } = req.params;

  if (!resultId) {
    return res.status(400).json(new ApiError(400, "Result ID is required"));
  }

  const result = await prisma.result.findUnique({
    where: { resultId },
  });
  if (!result) {
    return res.status(404).json(new ApiError(404, "Result not found"));
  }

  await prisma.result.delete({ where: { resultId } });

  // Recompute CGPA since a result was removed
  await recomputeAndUpdateCgpa(result.studentId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Result deleted successfully"));
});

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Compute letter grade from marks (out of 100)
 */
const computeGrade = (marks: number): string => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
};

/**
 * Recompute CGPA from all results and update student record
 * Called after every create/update/delete
 */
const recomputeAndUpdateCgpa = async (studentId: string) => {
  const allResults = await prisma.result.findMany({
    where: { studentId },
    select: {
      marks: true,
      semester: true,
      subject: { select: { credits: true } },
    },
  });

  if (allResults.length === 0) {
    await prisma.student.update({
      where: { id: studentId },
      data: { cgpa: 0 },
    });
    return;
  }

  // Group by semester → compute SGPA per sem → weighted CGPA
  const semesterMap = new Map<
    number,
    { totalWeightedMarks: number; totalCredits: number }
  >();

  for (const r of allResults) {
    const sem = r.semester;
    const credits = r.subject.credits;
    const existing = semesterMap.get(sem) ?? {
      totalWeightedMarks: 0,
      totalCredits: 0,
    };
    semesterMap.set(sem, {
      totalWeightedMarks: existing.totalWeightedMarks + r.marks * credits,
      totalCredits: existing.totalCredits + credits,
    });
  }

  let totalWeightedSgpa = 0;
  let totalCreditsOverall = 0;

  for (const [, { totalWeightedMarks, totalCredits }] of semesterMap) {
    const sgpa = totalWeightedMarks / totalCredits; // SGPA for this sem
    totalWeightedSgpa += sgpa * totalCredits;
    totalCreditsOverall += totalCredits;
  }

  const cgpa = parseFloat((totalWeightedSgpa / totalCreditsOverall).toFixed(2));

  await prisma.student.update({
    where: { id: studentId },
    data: { cgpa },
  });
};

/**
 * Group raw results by semester and compute SGPA + running CGPA per semester
 * Used in GET results response
 */
export const groupAndComputeCgpaHistory = (results: any[]) => {
  // Group results by semester
  const semesterMap = new Map<number, any[]>();
  for (const r of results) {
    const existing = semesterMap.get(r.semester) ?? [];
    semesterMap.set(r.semester, [...existing, r]);
  }

  const cgpaHistory: {
    semester: number;
    sgpa: number;
    cgpa: number;
    totalCredits: number;
  }[] = [];
  const semesters: any[] = [];

  let cumulativeWeightedSgpa = 0;
  let cumulativeCredits = 0;

  for (const [semester, semResults] of [...semesterMap.entries()].sort(
    (a, b) => a[0] - b[0]
  )) {
    // Compute SGPA for this semester
    const totalWeightedMarks = semResults.reduce(
      (sum: number, r: any) => sum + r.marks * r.subject.credits,
      0
    );
    const totalCredits = semResults.reduce(
      (sum: number, r: any) => sum + r.subject.credits,
      0
    );
    const sgpa = parseFloat((totalWeightedMarks / totalCredits).toFixed(2));

    // Running CGPA up to this semester
    cumulativeWeightedSgpa += sgpa * totalCredits;
    cumulativeCredits += totalCredits;
    const cgpa = parseFloat(
      (cumulativeWeightedSgpa / cumulativeCredits).toFixed(2)
    );

    cgpaHistory.push({ semester, sgpa, cgpa, totalCredits });

    // Backlog count for this semester
    const backlogs = semResults.filter(
      (r: any) => r.status === ResultStatus.FAILED
    ).length;

    semesters.push({
      semester,
      sgpa,
      cgpa,
      totalCredits,
      backlogs,
      subjects: semResults.map((r: any) => ({
        resultId: r.resultId,
        subjectName: r.subject.subjectName,
        subjectCode: r.subject.subjectCode,
        credits: r.subject.credits,
        marks: r.marks,
        grade: r.grade,
        status: r.status,
      })),
    });
  }

  return { cgpaHistory, semesters };
};
