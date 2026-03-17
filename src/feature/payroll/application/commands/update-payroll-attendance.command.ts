export type UpdatePayrollAttendanceCommand = {
  id: string;
  farmId: string;
  userId: string;
  checkedInAt: Date;
  checkedOutAt: Date;
};
