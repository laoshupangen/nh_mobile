import instance from './instance'

export const getApprovalV2List = ({ rows, page, Status}) => {
  return instance.get('/Dorm/Leave/Load', {
    params: {
      rows,
      page,
      Status
    }
  })
}

export const applyLeaveV2 = ({ LeaveerId, StartTime, EndTime,  LeaveDays, LeaveType, ReasonForLeave,Approvers,AttachmentsPath }) => {
  return instance.post('/Dorm/Leave/Apply', {
    LeaveerId,
    Approvers,
    StartTime,
    EndOfTime:EndTime,
    LeaveDays,
    LeaveType,
    ReasonForLeave,
    AttachmentsPath
  })
}

export const getLeaveV2List = ({ rows, page, userId,Status}) => {
  return instance.get('/Dorm/Leave/GetLeaveHistory', {
    params: {
      rows,
      page,
      userId,
      Status
    }
  })
}

//提交审批
export const postLeaveV2Approval = ({ orderId, isAgreed, opinion,approverList}) => {
  return instance.post('/Dorm/leave/approval', {
    orderId, 
    isAgreed, 
    opinion, 
    approverList
  })
}

//提交审批  添加二级审批人
export const AddApprover = ({ orderId, approverId }) => {
  return instance.post('/Dorm/leave/AddApprover', {
    approverId,
    orderId, 
  })
}

//审批详情-审批单
export const getLeaveV2FromDetail = (id) => {
  return instance.get('/Dorm/Leave/Get', {
    params: {
      id
    }
  })
}

//请假详情
export const getLeaveV2Detail = (id) => {
  return instance.get('/Dorm/Leave/GetDetail', {
    params: {
      id
    }
  })
}

//提交销假         
export const postCancelholiday = ({ orderId}) => {
  return instance.post('/dorm/leave/SuspendLeave', {
    orderId,
  })
}

//获取请假节假日列表
export const getHolidaList = () => {
  return instance.get('/Dorm/Holiday/getlist')
}

//获取请假历史老师记录
export const getTeacherHistory = () => {
  return instance.get('/Dorm/Leave/ApproveHistory')
}