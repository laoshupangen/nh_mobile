import instance from './instance'

export const getCoursePrepareInfoById = ({ CoursePrepareId, CourseId, Time_Sect, F_Date, ClassId, TeacherId }) => {
  return instance.get('/WeChat/Schedules/GetCoursePrepareInfoById', {
    params: {
      CoursePrepareId,
      CourseId,
      Time_Sect,
      F_Date,
      ClassId, 
      TeacherId
    }
  })
}

export const submitCoursePrepareInfo = ({ CoursePrepareId, TeacherId, CourseId, ClassID, Memo, Homework, Prepare, Knowledge, Attachments, F_Date, Time_Sect }) => {
  return instance.post('/WeChat/Schedules/SubmitCoursePrepareInfo', { 
    CoursePrepareId,
    TeacherId,
    CourseId, 
    ClassID, 
    Memo, 
    Homework, 
    Prepare, 
    Knowledge, 
    Attachments,
    F_Date, 
    Time_Sect
  })
}

export const getCoursePrepareList = ({ UserId, Time }) => {
  return instance.post('/WeChat/Schedules/GetCoursePrepareList', {
    UserId: UserId,
    Date: Time
  })
}

export const getResource = ({ page, rows = 15, F_Name, sord = 'desc', sidx = 'F_CreatorTime' }) => {
  return instance.get('/SchoolManage/School_Attachments/GetMyGridJson', {
    params: {
      page,
      rows,
      F_Name,
      sord,
      sidx
    }
  })
}