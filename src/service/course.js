import instance from './instance'

export const getStudentCourse = (userId) => {
  return instance.get('/WeChat/Schedules/GetSchedulesByStudentUserId', {
    params: {
      userId
    }
  })
}

export const getCourseTime = (classId) => {
  return instance.get('/SchoolManage/School_Schedules_Time/GetSchedulesTime', {
    params: {
      F_Class: classId
    }
  })
}

export const geTeacherCourse = (userId) => {
  return instance.get('/WeChat/Schedules/GetSchedulesByTeacherUserId', { 
    params: {
      userId
    }
  })
}