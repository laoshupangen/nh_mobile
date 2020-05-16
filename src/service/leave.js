import instance from './instance'

export const applyLeave = ({ F_Applicant, F_StartTime, F_EndTime, F_StudentID, F_LeaveDays, F_LeaveType, F_ReasonForLeave }) => {
  return instance.post('/WeChat/Leave/Apply', {
    F_Applicant, 
    F_StartTime, 
    F_EndTime, 
    F_StudentID, 
    F_LeaveDays, 
    F_LeaveType,
    F_ReasonForLeave
  })
}

export const getLeaveList = (id) => {
  return instance.post('/Wechat/Leave/List', {id})
}

export const getLeaveListTeacher = ({
  status,
  rows, 
  page, 
  sidx = "F_CreatorTime desc", 
  keywork = ''
}) => {
  return instance.get('/SchoolManage/School_Stu_Leave/List', {
	params: {
      status,
	  rows,
	  page,
	  sidx,
	  keywork
	}
  })
}

export const approvalLeave = ({ id, approvalOpinion, status }) => {
  return instance.post('/SchoolManage/School_Stu_Leave/Approving', {
    id, 
	approvalOpinion, 
	status
  })
}