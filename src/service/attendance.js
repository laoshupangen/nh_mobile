import instance from './instance'

export const getAttendanceById = ({
  time,
  classId,
  student
}) => {
  return instance.post('/WeChat/Attendance/getMySignInfo', {
    F_Date: time,
    F_Class: classId,
    F_Student: student
  })
}