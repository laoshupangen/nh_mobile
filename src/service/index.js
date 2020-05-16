import { userLogin, userLogout, restoreLogin, bindChild, getHonor, updateParentAvatar, getDictionary, getSerialNumber, getAppkey, getProfileById, 
  getSchoolList,TeacherBindClass ,GetBindClass,getPhotosList,getPhotoDetails,setApprovalInfo,getStatusByStudent,showOut} from './user'
import { getNews, postNews } from './news'
import { getNoti, postNoti , GetLateReturnReport , GetNotReturnReport,  GetNotOutReport} from './notification'
import { getActivity, postActivity } from './activity'
import { getPresence, postPresence } from './presence'
import { getHistMsg, sendMsg, getPhoneBook,getTeacherPhoneBook, readMsg, getMsgHistory, getChatSession } from './message'
import { getStudentCourse, geTeacherCourse, getCourseTime } from './course'
import { submitCoursePrepareInfo, getCoursePrepareInfoById, getCoursePrepareList, getResource } from './prepare'
import { getClassDetailInfo, getTeacherDetailInfo, getStudentDetailInfo } from './classes'
import { getAttendanceById } from './attendance'
import { applyLeave, getLeaveList, getLeaveListTeacher, approvalLeave } from './leave'
import { getWishCourseTask, getCourseGroup, setCourseGroup, getCourseReport } from './chooseClass'
import { getApprovalV2List,postLeaveV2Approval,applyLeaveV2,getLeaveV2List,getLeaveV2Detail,getLeaveV2FromDetail ,postCancelholiday,AddApprover,getHolidaList,getTeacherHistory} from './leaveV2'
import { getInOutLogByDay,getLateInLog,getNotInLog,getNotOutLog ,GetSelectJsonByCategoryId,GetGridSelectByClassId,GetDormRecords,
  GetLateListByDivis,GetLateListByClass,GetLateListByGrade,
  GetLateList,GetNoReturnList,GetNoOutList,GetNoReturnListByClass,GetNoOutListByClass} from './dormInOutLog'
import {ApprovalStatus,getVisitorList,getVisitorDetail,uploadFile,VisitorInfoSubmit ,searchStudentByNameOrNum,GetBuildLimit,deleteVisitLog} from './searchSudent'
import {postLoadByOrg,postLoadByStu,getDorms,getDormInfo,getClassList,getHeadmasterData,getcarData,getSafeData,
  IsClass,getExceptionInfo,getNoreturnDetail,getNoLatereturnDetail,
  orgResult,organResultNoReturn,organResultLateReturn,organResultNoOut,organResultContiInOut,getNoRecord,getNoOutList} from './homePage'
import {getCurrentStudentInfo,applyForCheckOut,approvalForCheckOut,checkOutPage,applyForRepair,approvalForRepair,
  repairPage,applyForCheckin,approvalForCheckin,checkinPage,applyForDormExchange,approvalForDormExchange,
  getCampus,getBuild,DormExchangePage} from './dormitory'

import {GetLatestDormitoryStatistics,GetLatestDormitoryGraphicStatistics,ReportStudent,CheckStudent,GetSafeDormStudentById,GetSafeDormReportList,
  UpdateStudentInOutStatus,GetSafeDormReport,GetSafeDormStudent,GetStudentOrgAll} from './safeReturn'

export {
  userLogin,
  userLogout,
  restoreLogin,
  bindChild,
  TeacherBindClass,
  GetBindClass,
  getNews,
  postNews,
  getNoti,
  postNoti,
  GetLateReturnReport ,
  GetNotReturnReport, 
  GetNotOutReport,
  getActivity,
  postActivity,
  getProfileById,
  getPresence,
  postPresence,
  getResource,
  getHistMsg,
  sendMsg,
  getStudentCourse,
  geTeacherCourse,
  submitCoursePrepareInfo,
  getCoursePrepareInfoById,
  getPhoneBook,
  getCoursePrepareList,
  getClassDetailInfo,
  getTeacherDetailInfo,
  getStudentDetailInfo,
  getCourseTime,
  getAttendanceById,
  getHonor,
  updateParentAvatar,
  readMsg,
  applyLeave,
  getLeaveList,
  getLeaveListTeacher,
  approvalLeave,
  getWishCourseTask,
  getCourseGroup,
  setCourseGroup,
  getCourseReport,
  getDictionary,
  getMsgHistory,
  getChatSession,
  getSerialNumber,
  getAppkey,
  getSchoolList,
  getApprovalV2List,
  getTeacherPhoneBook,
  applyLeaveV2,
  AddApprover,
  getHolidaList,
  getTeacherHistory,
  postLeaveV2Approval,
  getLeaveV2List,
  getLeaveV2Detail,
  getLeaveV2FromDetail,
  postCancelholiday,
  getInOutLogByDay,
  getLateInLog,
  getNotInLog,
  getNotOutLog,
  GetSelectJsonByCategoryId,
  GetGridSelectByClassId,
  GetDormRecords,
  GetLateListByClass,
  GetLateListByDivis,
  GetLateListByGrade,
  GetNoReturnListByClass,
  GetNoOutListByClass,
  GetLateList,
  GetNoReturnList,
  GetNoOutList,
  ApprovalStatus,
  getVisitorList,
  getVisitorDetail,
  uploadFile,
  VisitorInfoSubmit,
  getPhotosList,
  getPhotoDetails,
  setApprovalInfo,
  postLoadByOrg,
  postLoadByStu,
  searchStudentByNameOrNum,
  GetBuildLimit,
  getDorms,
  getDormInfo,
  getClassList,
  deleteVisitLog,
  getCurrentStudentInfo,applyForCheckOut,approvalForCheckOut,
  checkOutPage,applyForRepair,approvalForRepair,
  repairPage,applyForCheckin,approvalForCheckin,checkinPage,
  applyForDormExchange,approvalForDormExchange,DormExchangePage,
  getCampus,getBuild,
  getHeadmasterData,getcarData,getSafeData,orgResult,
  IsClass,
  organResultNoReturn,organResultLateReturn,organResultNoOut,organResultContiInOut,
  getExceptionInfo,getNoreturnDetail,getNoLatereturnDetail,
  getNoOutList,getNoRecord,
  getStatusByStudent,
  showOut,GetLatestDormitoryStatistics,GetLatestDormitoryGraphicStatistics,
  ReportStudent,CheckStudent,GetSafeDormStudentById,GetSafeDormReportList,
  UpdateStudentInOutStatus,GetSafeDormReport,GetSafeDormStudent,GetStudentOrgAll
}