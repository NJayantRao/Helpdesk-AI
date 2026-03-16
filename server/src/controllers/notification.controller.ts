import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { NotificationType } from "@prisma/client";

/**
 * @route POST /notification/
 * @description Create a notification (global or department-specific)
 * @access private (admin only)
 */
export const createNotification = AsyncHandler(async (req: any, res: any) => {
  const { title, body, source, type, departmentId } = req.body;

  if (!title || !body || !source || !type) {
    return res
      .status(400)
      .json(new ApiError(400, "title, body, source and type are required"));
  }

  // Validate type is a valid enum value
  if (!Object.values(NotificationType).includes(type)) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          `type must be one of: ${Object.values(NotificationType).join(", ")}`
        )
      );
  }

  // If departmentId provided, verify it exists
  if (departmentId) {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      return res.status(404).json(new ApiError(404, "Department not found"));
    }
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      body,
      source,
      type,
      departmentId: departmentId || null, // null = global
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Notification created successfully", notification)
    );
});

/**
 * @route GET /notification/
 * @description Get all notifications (admin view, paginated)
 * @access private (admin only)
 */
export const getAllNotifications = AsyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalNotifications = await prisma.notification.count();

  const notifications = await prisma.notification.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      source: true,
      type: true,
      departmentId: true,
      department: { select: { name: true } },
      createdAt: true,
      _count: { select: { reads: true } }, // how many students have read it
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Notifications fetched successfully", {
      notifications,
      totalNotifications,
      page,
      totalPages: Math.ceil(totalNotifications / limit),
    })
  );
});

/**
 * @route DELETE /notification/:notificationId
 * @description Delete a notification
 * @access private (admin only)
 */
export const deleteNotification = AsyncHandler(async (req: any, res: any) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return res
      .status(400)
      .json(new ApiError(400, "Notification ID is required"));
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return res.status(404).json(new ApiError(404, "Notification not found"));
  }

  // onDelete: Cascade on NotificationRead handles cleanup automatically
  await prisma.notification.delete({ where: { id: notificationId } });

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted successfully"));
});

/**
 * @route GET /student/notifications
 * @description Get all notifications for logged-in student
 *              (their department + global), with per-student read status
 * @access private (student only)
 */
export const getStudentNotifications = AsyncHandler(
  async (req: any, res: any) => {
    const userId = req.user.id;

    // Get student with their departmentId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        departmentId: true,
        student: { select: { id: true } },
      },
    });

    if (!user?.student) {
      return res.status(404).json(new ApiError(404, "Student not found"));
    }

    const studentId = user.student.id;

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { departmentId: null }, // global
          { departmentId: user.departmentId }, // their dept
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        source: true,
        type: true,
        createdAt: true,
        reads: {
          where: { studentId }, // only this student's read record
          select: { readAt: true },
        },
      },
    });

    // Flatten read status into each notification
    const result = notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      source: n.source,
      type: n.type,
      createdAt: n.createdAt,
      read: n.reads.length > 0, // true if this student has read it
      readAt: n.reads[0]?.readAt ?? null,
    }));

    const unreadCount = result.filter((n) => !n.read).length;

    return res.status(200).json(
      new ApiResponse(200, "Notifications fetched successfully", {
        notifications: result,
        unreadCount,
      })
    );
  }
);

/**
 * @route GET /student/notifications/unread-count
 * @description Get just the unread count for bell badge
 * @access private (student only)
 */
export const getUnreadCount = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      departmentId: true,
      student: { select: { id: true } },
    },
  });

  if (!user?.student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const studentId = user.student.id;

  // Total notifications visible to this student
  const totalVisible = await prisma.notification.count({
    where: {
      OR: [{ departmentId: null }, { departmentId: user.departmentId }],
    },
  });

  // Total read by this student
  const totalRead = await prisma.notificationRead.count({
    where: { studentId },
  });

  const unreadCount = totalVisible - totalRead;

  return res.status(200).json(
    new ApiResponse(200, "Unread count fetched successfully", {
      unreadCount: Math.max(0, unreadCount), // never negative
    })
  );
});

/**
 * @route PATCH /student/notifications/:notificationId/read
 * @description Mark a single notification as read
 * @access private (student only)
 */
export const markOneAsRead = AsyncHandler(async (req: any, res: any) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  if (!notificationId) {
    return res
      .status(400)
      .json(new ApiError(400, "Notification ID is required"));
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { student: { select: { id: true } } },
  });

  if (!user?.student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const studentId = user.student.id;

  // Verify notification exists
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return res.status(404).json(new ApiError(404, "Notification not found"));
  }

  // upsert — safe to call multiple times, won't duplicate
  await prisma.notificationRead.upsert({
    where: {
      notificationId_studentId: { notificationId, studentId },
    },
    create: { notificationId, studentId },
    update: {}, // already read, nothing to update
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read"));
});

/**
 * @route PATCH /student/notifications/mark-all-read
 * @description Mark all unread notifications as read for the student
 * @access private (student only)
 */
export const markAllAsRead = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      departmentId: true,
      student: { select: { id: true } },
    },
  });

  if (!user?.student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const studentId = user.student.id;

  // Get all visible notifications for this student
  const visibleNotifications = await prisma.notification.findMany({
    where: {
      OR: [{ departmentId: null }, { departmentId: user.departmentId }],
    },
    select: { id: true },
  });

  // Get already read notification ids
  const alreadyRead = await prisma.notificationRead.findMany({
    where: { studentId },
    select: { notificationId: true },
  });

  const alreadyReadIds = new Set(alreadyRead.map((r) => r.notificationId));

  // Filter to only unread ones
  const unreadIds = visibleNotifications
    .map((n) => n.id)
    .filter((id) => !alreadyReadIds.has(id));

  if (unreadIds.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "All notifications already read"));
  }

  // Bulk create read records
  await prisma.notificationRead.createMany({
    data: unreadIds.map((notificationId) => ({ notificationId, studentId })),
    skipDuplicates: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "All notifications marked as read", {
      markedCount: unreadIds.length,
    })
  );
});
