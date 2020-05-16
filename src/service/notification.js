import instance from './instance'

export const getNoti = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc", F_Class, F_Type }) => {
  return instance.get('/SchoolManage/School_Notice/GetIndexNoticeJson', {
    params: {
      rows, 
      page, 
      sidx, 
      sord, 
      F_Class, 
      F_Type
    }
  })
}

export const postNoti = ({ Title, Banner, F_Type, F_Class, Detail }) => {
  return instance.post('/SchoolManage/School_Notice/SubmitForm', {
    Title,
    Banner,
    F_Type,
    F_Class,
    Detail
  })
}

//晚归学生统计按班级 --消息推送单页
export const GetLateReturnReport = ({ OrgId,ReportDate}) => {
  return instance.get('Dorm/NHExceptionPush/GetLateReturnReport', {
      params: {
        OrgId,
        ReportDate
    }
  })
}

//未归学生统计按班级 --消息推送单页
export const GetNotReturnReport = ({ OrgId,ReportDate}) => {
  return instance.get('Dorm/NHExceptionPush/GetNotReturnReport', {
      params: {
        OrgId,
        ReportDate
    }
  })
}

//未出学生统计按班级 --消息推送单页
export const GetNotOutReport = ({ OrgId,ReportDate}) => {
  return instance.get('Dorm/NHExceptionPush/GetNotOutReport', {
      params: {
        OrgId,
        ReportDate
    }
  })
}