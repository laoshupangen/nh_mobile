import instance from './instance'
//审批
export const ApprovalStatus = ({ visitId, IsAgreed, Opinion }) => {
  return instance.post('/Dorm/VisitLog/ApprovalVisitor', { visitId, IsAgreed, Opinion })
}
// 详情
export const getVisitorDetail = (visitId) => {
  return instance.get('/Dorm/VisitLog/GetVisitor', { params: { visitId } })
}

export const getVisitorList = ({
   rows,
   page,
  // sidx = 'CreateTime',
  // sord = 'desc',
  ApprovalStatus,
}) => {
  return instance.get('/Dorm/VisitLog/GetVisitorList', {
    params: {
       rows,
       page,
      // sidx,
      // sord,
      ApprovalStatus,
    }
  })
}
export const getCheckType = ({ VisitorLoginId, UserId, CheckType }) => {
  return instance.get('/Dorm/VisitLog/CheckVisitor', { params: { VisitorLoginId, UserId, CheckType } })
}
export const uploadFile = ({ file }) => {
  return instance.post('/Dorm/VisitLog/UploadImg', { file })
}
export const VisitorInfoSubmit = ({
  VisitorName,
  VisitType,
  VisitorIDCard,
  VisitReason,
  VisitStartTime,
  VisitEndTime,
  Relationship,
  VisitorGender,
  VisitorId
}) => {
  return instance.post('/Dorm/VisitLog/SubmitVisitor', {
    VisitorName,
    VisitType,
    VisitorIDCard,
    VisitReason,
    VisitStartTime,
    VisitEndTime,
    Relationship,
    VisitorGender,
    VisitorId
  })
}


//搜索学生
export const searchStudentByNameOrNum = (KeyWords) => {
  return instance.get('/Dorm/VisitLog/SearchStudent', {
    params: {
      KeyWords
    }
  })
}

//查询同学互访额度
export const GetBuildLimit = () => {
  return instance.get('/Dorm/VisitLog/GetBuildLimit')
}

//撤销Dorm/VisitLog/CancellVisit   GET   (string applyId)
export const deleteVisitLog = (applyId)=>{
  return instance.get('Dorm/VisitLog/CancellVisit',{params:{applyId}})
}
