import instance from './instance'

export const getWishCourseTask = (StudentId) => {
  return instance.get('/WeChat/CourseGroup/GetWishCourseTask', {
    params: {
      StudentId
    }
  })
}

export const getCourseGroup = (TaskId) => {
  return instance.get('/WeChat/CourseGroup/GetCourseGroup', {
    params: {
      TaskId  
    }
  })
}

export const setCourseGroup = ({ StudentId, TaskId, CourseGroupId }) => {
  return instance.post('/WeChat/CourseGroup/SetStudentCourseGroup', {
    StudentId, 
    TaskId, 
    CourseGroupId
  })
}

export const getCourseReport = (TaskId) => {
  return instance.get('/WeChat/CourseGroup/GetCourseGroupReport', {
    params: {
      TaskId
    }
  })
}