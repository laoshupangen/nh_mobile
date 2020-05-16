import instance from './instance'

export const getClassDetailInfo = (classId) => {
  return instance.get('/SchoolManage/class/detail', {
    params: {
      classId: classId
    }
  })
}

export const getTeacherDetailInfo = (teacherId) => {
  return instance.get('/SchoolManage/School_Teachers/GetTeacherDetailInfo', {
    params: {
      F_TeacherId: teacherId
    }
  })
}

export const getStudentDetailInfo = (studentId) => {
  return instance.get('/SchoolManage/School_Students/GetStudentDetailInfo', {
    params: {
      F_StudentId: studentId
    }
  })
}
