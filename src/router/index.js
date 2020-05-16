import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'

import Home from '@/page/Home/Home'
import Message from '@/page/Home/children/Message/Message'
import MessageContent from '@/page/Home/children/Message/MessageList'
import PhoneBook from '@/page/Home/children/Message/PhoneBook'
import School from '@/page/Home/children/School/School'
import Profile from '@/page/Home/children/Profile/Profile'
import Class from '@/page/Class/Class'
import Schedule from '@/page/Schedule/Schedule'
import PrepareClass from '@/page/PrepareClass/PrepareClass'
import PrepareDetail from '@/page/PrepareClass/PrepareDetail'
import PrepareResource from '@/page/PrepareClass/ResourceLibrary'
import Notification from '@/page/Notification/Notification'
import NotiPublish from '@/page/Notification/Publish'
import News from '@/page/News/News'
import NewsPublish from '@/page/News/Publish'
import Presence from '@/page/Presence/Presence'
import Detail from '@/page/Detail/Detail'
import PresencePublish from '@/page/Presence/Publish'
import Homework from '@/page/Homework/Homework'
import Attendance from '@/page/Attendance/Attendance'
import Activity from '@/page/Activity/Activity'
import ActivityPublish from '@/page/Activity/Publish'
import TeacherIntro from '@/page/Intro/TeacherIntro'
import StudentIntro from '@/page/Intro/StudentIntro'
import Login from '@/page/Login/Login'
import TeacherBindClass from '@/page/Login/TeacherBindClass'
import BindChild from '@/page/BindChild/BindChild'
import Leave from '@/page/Leave/Leave'
// import Tablelist from '@/page/Leave/Tablelist'
import LeaveApprovalList from '@/page/LeaveApproval/LeaveList'
import ChooseClass from '@/page/ChooseClass/ChooseClass'
import CourseGroup from '@/page/ChooseClass/CourseGroup'
import CourseChart from '@/page/ChooseClass/CourseChart'

//新添加bycaihui
import Visit from '@/page/Visit/Visit'
import VisitorOutSchool from '@/page/Visit/VisitorOutSchool'
import VisitorInfo from '@/page/visit/VisitorInfo'
import VisitorApproval from '@/page/visit/VisitorApproval'
import VisitList from '@/page/visit/visitorList'


// 请假模块宿舍版
import ApprovalV2 from '@/page/LeaveV2/ApprovalV2'
import ApprovalV2Form from '@/page/LeaveV2/ApprovalV2Form'
import LeaveV2List from '@/page/LeaveV2/LeaveV2List'
import LeaveV2Form from '@/page/LeaveV2/LeaveV2Form'
import LeaveV2Detail from '@/page/LeaveV2/LeaveV2Detail'
import TeacherSelect from '@/page/LeaveV2/TeacherSelect'


//宿舍出入模块 add by ben
import InOut from '@/page/DormInOut/InOut'
import LateIn from '@/page/DormInOut/LateIn'
import NotIn from '@/page/DormInOut/NotIn'
import NotOut from '@/page/DormInOut/NotOut'
import LateInClassList from '@/page/DormInOut/LateInClassList'
import LateInDivisList from '@/page/DormInOut/LateInDivisList'
import LateInGradeList from '@/page/DormInOut/LateInGradeList'
import NotInList from '@/page/DormInOut/NotInList'
import NotOutList from '@/page/DormInOut/NotOutList'

import inOutStudent from '@/page/DormInOut/inOutStudent'
import LateInStudent from '@/page/DormInOut/LateInStudent'
import NotOutStudent from '@/page/DormInOut/NotOutStudent'
import NotInStudent from '@/page/DormInOut/NotInStudent'
//消息推送异常报表(单页)
import LateInReportMsg from '@/page/DormInOut/ReportMsg/LateInReportMsg'
import NotInReportMsg from '@/page/DormInOut/ReportMsg/NotInReportMsg'
import NotOutReportMsg from '@/page/DormInOut/ReportMsg/NotOutReportMsg'

//拍照及照片采集
import SetPhotoInfo from '@/page/TakePhotos/SetPhotoInfo'
import TakePhoto from '@/page/TakePhotos/TakePhoto'
import PhotoDetail from '@/page/TakePhotos/PhotoDetail'
import ApprovalPhotos from '@/page/TakePhotos/ApprovalForPhotos'

//首页统一视图
import Homepage from '@/page/Home/children/Homepage/Homepage'
import HomepageTeacher from '@/page/Home/children/Homepage/HomepageTeacher'
import HomepageDormitory from '@/page/Home/children/Homepage/HomepageDormitory'

// 新增视图
import newHomepage from '@/page/Home/children/Homepage/newHomepage'
import newStudenthome from '@/page/Home/children/Homepage/newStudentHome'
import Monitor from '@/page/Home/children/Homepage/newMonitorhome'
import HeadMaster from '@/page/Home/children/Homepage/HeadMaster'
import newException from '@/page/DormInOut/ReportMsg/newException'

// 宿舍相关
import CancelResidence from '@/page/Dormitory/CancelResidence'
import approvalForResidence from '@/page/Dormitory/approvalForResidence'
import ListForResidence from '@/page/Dormitory/ListForResidence'
import ListForRepair from '@/page/Dormitory/ListForRepaire'
import ListForAccomadation from '@/page/Dormitory/ListForAccomadation'
import ListForRegister from '@/page/Dormitory/ListForRegister'
import DormitoryRepair from '@/page/Dormitory/DormitoryRepair'
import Accommodation from '@/page/Dormitory/Accommodation'
import RegisterForNew from '@/page/Dormitory/RegisterForNew'
import DomitoryDetail from '@/page/Dormitory/DomitoryDetail'

// 疫情相关
import noReportList from '@/page/Epidemic/noReportList.vue'
import noReturnReport from '@/page/Epidemic/noReturnReport.vue'
import returnReport from '@/page/Epidemic/returnReport.vue'
import returnPreview from '@/page/Epidemic/returnPreview.vue'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: 'school',
    children: [
      {
        path: 'message',
        name: 'Message',
        component: Message,
        meta: {
          title: '消息',
          top: {
            iconClass: 'user-alt',
            roles: ['teacherDuty', 'admin', 'parentDuty']
          }
        }
      },
      {
        path: 'school',
        name: 'School',
        component: School,
        meta: {
          title: '功能',
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: '我的',
        }
      },
      {
        path: '/Homepage',
        name: 'Homepage',
        component: newStudenthome,
        redirect: 'individual',
        children: [
          {
            path: '/individual',
            name: 'Individual',
            component: () => import('@/page/Home/children/Homepage/Homepage'),
            meta: {
              isNoXHeader: true,
              roles: ['studentDuty'],
            }
          }, {
            path: '/organization',
            name: 'Organization',
            component: () => import('@/page/Home/children/Homepage/newHomepage'),
            meta: {
              isNoXHeader: true,
              roles: ['studentDuty'],
            }
          }],
      }, {
        path: '/newHomepage',
        name: 'newHomepage',
        component: () => import('@/page/Home/children/Homepage/newHomepage'),
        meta: {
          isNoXHeader: true,
          title: '智慧校园',
          roles: ['teacherDuty', 'admin'],
        }
      }, {
        path: '/HomepageDormitory',
        name: 'HomepageDormitory',
        component: HomepageDormitory,
        meta: {
          isNoXHeader: true,
          roles: ['suguanDuty'],
        }
      },
      {
        path: '/headmaster',
        name: 'HeadMaster',
        component: HeadMaster,
        meta: {
          isNoXHeader: true,
          roles: ['teacherDuty'],
        }
      },

    ]
  },
  {
    path: '/details',
    name: 'Details',
    component: () => import('@/page/DetailForHome/details'),
    meta: {
      title: '异常人员详情'
    }
  },

  {
    path: '/teacher/:id',
    name: 'Teacher',
    component: TeacherIntro,
    meta: {
      title: '教师详情'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      isNoXHeader: true,
    }
  },
  {
    path: '/student/:id',
    name: 'Student',
    component: StudentIntro,
    meta: {
      title: '班级详情'
    }
  },
  {
    path: '/PhotosList',
    name: 'PhotosList',
    component: ApprovalPhotos,
    meta: {
      title: '申请列表',

    }
  },

  {
    path: '/takephoto',
    name: 'TakePhoto',
    component: TakePhoto,
    meta: {
      title: '拍照',

    }
  },
  {
    path: '/photoDetails/:id',
    name: 'PhotoDetail',
    component: PhotoDetail,
    meta: {
      title: '照片审核',
    }
  },

  {
    path: '/visitorDetail/:id',
    name: 'VisitorApproval',
    component: VisitorApproval,
    meta: {
      title: [
        { level: 'studentDuty', name: '访客详情' },
        { level: 'suguanDuty', name: '访客审批' },
        { level: 'teacherDuty', name: '访客审批' },
      ],
    }
  },




  {
    path: '/approvalForResidence',
    name: 'approvalForResidence',
    component: approvalForResidence,
    meta: {
      title: '退宿审批'
    }
  },
  {
    path: '/DomitoryDetail',
    name: 'DomitoryDetail',
    component: DomitoryDetail,
    meta: {
      title: '审批'
    }
  }, {
    path: '/noReportList',
    name: 'noReportList',
    component: noReportList,
    meta: {
      title: '未归人员'
    }
  },
  {
    path: '/noReturnReport',
    name: 'noReturnReport',
    component: noReturnReport,
    meta: {
      title: '未归人员'
    }
  },
  {
    path: '/returnReport',
    name: 'returnReport',
    component: returnReport,
    meta: {
      title: '归寝报告',
    }

  },

]
//宿管测试
export const asyncRouterMap = [
  {
    path: '/class',
    name: 'Class',
    component: Class,
    meta: {
      title: '班级',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: false,
      category: '管理',
      background: {
        start: '#ABDCFF',
        end: '#0396FF',
        icon: 'chalkboard'
      }
    }
  },
  {
    path: `http://192.168.0.104:8102/#/app/home/subjectchoose`,
    subSystem: true,
    name: 'EntranceSign',
    meta: {
      title: '入学报名',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '报名',
      background: {
        start: '#ABDCFF',
        end: '#0396FF',
        icon: 'user-graduate'
      }
    }
  },
  {
    path: `http://192.168.0.104:8102/#/app/home/chooseexam`,
    subSystem: true,
    name: 'ExamSign',
    meta: {
      title: '考试报名',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '报名',
      background: {
        start: '#ABDCFF',
        end: '#0396FF',
        icon: 'graduation-cap'
      }
    }
  },
  {
    path: `http://192.168.0.104:8102/#/app/home/sundryfees`,
    subSystem: true,
    name: 'SundryFees',
    meta: {
      title: '学杂费',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '报名',
      background: {
        start: '#ABDCFF',
        end: '#0396FF',
        icon: 'money-check-alt'
      }
    }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule,
    meta: {
      title: '课程表',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '管理',
      background: {
        start: '#FEB692',
        end: '#EA5455',
        icon: 'table'
      }
    }
  },
  {
    path: '/leave',
    name: 'Leave',
    component: Leave,
    meta: {
      title: '请假',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '管理',
      background: {
        start: '#A0FF9A',
        end: '#49BF18',
        icon: 'clock'
      },
      top: {
        iconClass: 'list-alt',
        roles: ['parentDuty', 'admin']
      }
    }
  },
  {
    path: '/leaveApproval',
    name: 'LeaveApproval',
    component: LeaveApprovalList,
    meta: {
      home: true,
      category: '常用',
      title: '请假审批',
      roles: ['teacherDuty', 'admin'],
      background: {
        start: '#A0FF9A',
        end: '#49BF18',
        icon: 'clock'
      }
    }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: Notification,
    meta: {
      title: '通知',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '管理',
      background: {
        start: '#FAD7A1',
        end: '#E96D71',
        icon: 'bell'
      },
      top: {
        iconClass: 'plus-circle',
        roles: ['teacherDuty', 'admin']
      }
    }
  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: {
      title: '新闻',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '管理',
      background: {
        start: '#E2B0FF',
        end: '#9F44D3',
        icon: 'newspaper'
      },
      top: {
        iconClass: 'plus-circle',
        roles: ['teacherDuty', 'admin']
      }
    }
  },
  {
    path: '/presence',
    name: 'Presence',
    component: Presence,
    meta: {
      title: '师生风采',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '测试1',
      background: {
        start: '#90F7EC',
        end: '#32CCBC',
        icon: 'leaf'
      },
      top: {
        iconClass: 'plus-circle',
        roles: ['teacherDuty', 'admin']
      }
    }
  },
  {
    path: '/homework',
    name: 'Homework',
    component: Homework,
    meta: {
      title: '作业',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '测试1',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'pencil-alt'
      },
    }
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: Attendance,
    meta: {
      title: '考勤',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '测试1',
      background: {
        start: '#FFE985',
        end: '#FA742B',
        icon: 'calendar-alt'
      },
    }
  },
  {
    path: '/activity',
    name: 'Activity',
    component: Activity,
    meta: {
      title: '活动',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '管理',
      background: {
        start: '#2AFADF',
        end: '#4C83FF',
        icon: 'volleyball-ball'
      },
      top: {
        iconClass: 'plus-circle',
        roles: ['teacherDuty', 'admin']
      }
    }
  },
  {
    path: '/prepareClass',
    name: 'PrepareClass',
    component: PrepareClass,
    meta: {
      title: '备课',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '测试2',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'chalkboard-teacher'
      },
    }
  },

  // { level: 'studentDuty', name: '访客详情' }, 
  //       { level: 'suguanDuty', name: '访客审批' },
  //       { level: 'teacherDuty', name: '访客审批' },
  {
    path: '/visitlist2',
    name: 'VisitList2',
    component: VisitList,
    meta: {
      title: '访客记录',
      roles: ['studentDuty'],
      home: true,
      category: '测试2',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'chalkboard-teacher'
      },
    }
  },
  {
    path: '/LeaveV2List',
    name: 'LeaveV2List',
    component: LeaveV2List,
    meta: {
      title: '请假列表',
      roles: ['studentDuty'],
      home: true,
      category: '测试2',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'clock'
      },
    }
  },

  {
    path: '/visitlist',
    name: 'VisitList',
    component: VisitList,
    meta: {
      title: '访客审批',
      roles: ['admin', 'suguanDuty'],
      home: true,
      category: '测试2',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'chalkboard-teacher'
      },
    }
  },
  {
    path: '/PhotosList',
    name: 'ApprovalPhotos',
    component: ApprovalPhotos,
    category: '常用',
    meta: {
      title: '照片审核',
      home: true,
      roles: ['admin', 'suguanDuty', 'teacherDuty'],
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'newspaper'
      },

    }
  },
  {
    path: '/chooseClass',
    name: 'ChooseClass',
    component: ChooseClass,
    meta: {
      title: '选课',
      roles: ['teacherDuty', 'parentDuty', 'admin'],
      home: true,
      category: '测试2',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'chalkboard-teacher'
      },
    }
  },
  {
    path: '/ApprovalV2',
    name: 'ApprovalV2',
    component: ApprovalV2,
    meta: {
      title: '请假审批',
      roles: ['teacherDuty', 'admin'],
      home: true,
      category: '常用',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'ApprovalV2'
      },
    }
  },
  {
    path: '/ListForRegister',
    name: 'ListForRegister',
    component: ListForRegister,
    meta: {
      title: '入住审批',
      home: false,
      roles: ['admin', 'suguanDuty'],
      background: {
        icon: 'rzdj'
      }
    },
  },
  {
    path: '/ListForResidence',
    name: 'ListForResidence',
    component: ListForResidence,
    meta: {
      title: '退宿审批',
      home: false,
      roles: ['admin', 'suguanDuty'],
      background: {
        icon: 'checkOut'
      }
    },
  },
  {
    path: '/ListForRepair',
    name: 'ListForRepair',
    component: ListForRepair,
    meta: {
      title: '报修审批',
      home: false,
      roles: ['admin', 'suguanDuty'],
      background: {
        icon: 'bxsq'
      }
    },
  },
  {
    path: '/Accommodation',
    name: 'Accommodation',
    component: Accommodation,
    meta: {
      title: '调宿申请',
      home: false,
      roles: ['admin', 'studentDuty'],
      background: {
        icon: 'tssq'
      }
    },
  },
  {
    path: '/RegisterForNew',
    name: 'RegisterForNew',
    component: RegisterForNew,
    meta: {
      title: '入住登记',
      home: false,
      roles: ['admin', 'studentDuty'],
      background: {
        icon: 'rzdj'
      }

    }
  },
  {
    path: '/DormitoryRepair',
    name: 'DormitoryRepair',
    component: DormitoryRepair,
    meta: {
      title: '报修申请',
      home: false,
      roles: ['admin', 'studentDuty'],
      background: {
        icon: 'bxsq'
      }

    }

  },
  {
    path: '/ListForAccomadation',
    name: 'ListForAccomadation',
    component: ListForAccomadation,
    meta: {
      title: '调宿审批',
      home: false,
      roles: ['admin', 'suguanDuty'],
      background: {
        icon: 'tssq'
      }
    }
  },
  {
    path: '/returnPreview',
    name: 'returnPreview',
    component: returnPreview,
    meta: {
      title: '平安归寝',
      home: true,
      roles: ['admin','teacherDuty'],
      background: {
        icon: 'pagq'
      }
    }
  },
  {
    path: '/noReportList',
    name: 'noReportList',
    component: noReportList,
    meta: {
      title: '归寝报告',
      home: true,
      roles: ['studentDuty','teacherDuty'],
      background: {
        icon: 'pagq'
      }
    }
  },

  //学生功能
  {
    path: '/cancelResidence',
    name: 'CancelResidence',
    component: CancelResidence,
    meta: {
      title: '退宿申请',
      roles: ['studentDuty', 'admin'],
      home: false,
      category: '宿舍',
      background: {
        start: '#A0FF9A',
        end: '#49BF18',
        icon: 'checkOut'
      }
    }
  },




  //待加

  {
    path: '/setphotoinfo',
    name: 'SetPhotoInfo',
    component: SetPhotoInfo,
    meta: {
      title: '照片采集',
      home: true,
      category: '常用',
      roles: ['teacherDuty', 'studentDuty', 'admin', 'suguanDuty'],
      background: {
        start: '#ABDCFF',
        end: '#0396FF',
        icon: 'phototake'
      }

    }
  },
  // {
  //   path: '/InOut',
  //   name: 'InOut',
  //   component: InOut,
  //   meta: {
  //     keepAlive: true,
  //     title: '进出记录',
  //     // roles: ['teacherDuty', 'studentDuty', 'admin', 'suguanDuty'],
  //     home: false,
  //     category: '记录查询',
  //     background: {
  //       start: '#CE9FFC',
  //       end: '#7367F0',
  //       icon: 'churu'
  //     },
  //   }
  // },
  // {
  //   path: '/LateIn',
  //   name: 'LateIn',
  //   component: LateIn,
  //   meta: {
  //     // keepAlive: true,
  //     title: '晚归记录',
  //     // roles: ['teacherDuty', 'studentDuty', 'admin', 'suguanDuty'],
  //     home: false,
  //     category: '记录查询',
  //     background: {
  //       start: '#CE9FFC',
  //       end: '#7367F0',
  //       icon: 'wangui'
  //     },
  //   }
  // },
  // {
  //   path: '/NotIn',
  //   name: 'NotIn',
  //   component: NotIn,
  //   meta: {
  //     keepAlive: true,
  //     title: '未归记录',
  //     // roles: ['teacherDuty', 'studentDuty', 'admin', 'suguanDuty'],
  //     home: false,
  //     category: '记录查询',
  //     background: {
  //       start: '#CE9FFC',
  //       end: '#7367F0',
  //       icon: 'weigui'
  //     },
  //   }
  // },
  // {
  //   path: '/NotOut',
  //   name: 'NotOut',
  //   component: NotOut,
  //   meta: {
  //     keepAlive: true,
  //     title: '未出',
  //     roles: ['admin',],
  //     home: false,
  //     category: '记录查询',
  //     background: {
  //       start: '#CE9FFC',
  //       end: '#7367F0',
  //       icon: 'weichu'
  //     },
  //   }
  // },
  {
    path: '/inOutStudent',
    name: 'inOutStudent',
    component: () => import('@/page/DormInOut/inOutStudent'),
    meta: {
      keepAlive: true,
      home: true,
      title: '进出记录',
      roles: ['studentDuty'],
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'churu'
      }
    }
  }, {
    path: '/LateInStudent',
    name: 'LateInStudent',
    component: () => import('@/page/DormInOut/LateInStudent'),
    meta: {
      title: '晚归记录',
      keepAlive: true,
      home: true,
      roles: ['studentDuty'],
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'wangui'
      }
    }
  }, {
    path: '/NotInStudent',
    name: 'NotInStudent',
    component: () => import('@/page/DormInOut/NotInStudent'),
    meta: {
      title: '未归记录',
      keepAlive: true,
      home: true,
      roles: ['studentDuty'],
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'weigui'
      }
    }



  }, {
    path: '/NotOutStudent',
    name: 'NotOutStudent',
    component: () => import('@/page/DormInOut/NotOutStudent'),
    meta: {
      title: '未出记录',
      keepAlive: true,
      home: true,
      roles: ['studentDuty'],
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'weichu'
      }
    }
  },
  {
    path: '/Exception',
    name: 'Exception',
    component: () => import('@/page/DormInOut/ReportMsg/newException'),
    meta: {
      title: '异常统计',
      roles: ['teacherDuty', 'admin', 'suguanDuty'],
      home: false,
      category: '记录查询',
      background: {
        start: '#CE9FFC',
        end: '#7367F0',
        icon: 'weichu'
      },
    }
  }

]

export const commonAsyncRouterMap = [{
  path: '/teacherBindClass',
  name: 'TeacherBindClass',
  component: TeacherBindClass,
  meta: {
    title: '绑定班级',
    roles: ['teacherDuty']
  }
}, {
  path: '/bindChild',
  name: 'BindChild',
  component: BindChild,
  meta: {
    title: '学生绑定',
    roles: ['parentDuty']
  }
}, {
  path: '/publishNoti',
  name: 'PublishNoti',
  component: NotiPublish,
  meta: {
    title: '发布通知',
    roles: ['teacherDuty', 'admin']
  }
}, {
  path: '/publishNews',
  name: 'PublishNews',
  component: NewsPublish,
  meta: {
    title: '发布新闻',
    roles: ['teacherDuty', 'admin']
  }
}, {
  path: '/publishActivity',
  name: 'PublishActivity',
  component: ActivityPublish,
  meta: {
    title: '发布活动',
    roles: ['teacherDuty', 'admin']
  }
}, {
  path: '/publishPresence',
  name: 'PublishPresence',
  component: PresencePublish,
  meta: {
    title: '发布风采',
    roles: ['teacherDuty', 'admin']
  }
}, {
  path: '/sendMessage',
  name: 'SendMessage',
  component: MessageContent,
  meta: {
    title: '发送消息',
    roles: ['teacherDuty', 'parentDuty', 'admin']
  }
}, {
  path: '/prepareDetail',
  name: 'PrepareDetail',
  component: PrepareDetail,
  meta: {
    title: '备课详情',
    roles: ['teacherDuty', 'parentDuty', 'admin'],
    top: {
      iconClass: 'pencil-alt',
      roles: ['teacherDuty', 'admin']
    }
  }
}, {
  path: '/phoneBook',
  name: 'PhoneBook',
  component: PhoneBook,
  meta: {
    title: '通讯录',
    roles: ['teacherDuty', 'parentDuty', 'admin'],
  }
}, {
  path: '/resourceLibrary',
  name: 'ResourceLibrary',
  component: PrepareResource,
  meta: {
    title: '资源选择',
    roles: ['teacherDuty', 'admin']
  }
}, {
  path: '/detail',
  name: 'Detail',
  component: Detail,
  meta: {
    roles: ['teacherDuty', 'parentDuty', 'admin']
  }
},
{
  path: '/tablelist',
  name: 'Tablelist',
  component: () => import('@/page/Leave/Tablelist'),
  meta: {
    title: '详情列表',
    roles: ['teacherDuty', 'admin', 'studentDuty']
  }
},
{
  path: '/Visitoroutschool',
  name: 'VisitorOutSchool',
  component: VisitorOutSchool,
  meta: {

    title: '校外来访',

  }
},
{
  path: '/visitorInSchool',
  name: 'VisitorInfoInSchool',
  component: VisitorInfo,
  meta: {
    title: '同学互访',

  }
},

{
  path: '/leaveV2Form',
  name: 'LeaveV2Form',
  component: LeaveV2Form,
  meta: {
    keepAlive: true,
    title: '不归宿请假',


  }
},
{
  path: '/courseGroup',
  name: 'CourseGroup',
  component: CourseGroup,
  meta: {
    title: '课程选择',
    roles: ['admin', 'parentDuty'],
    top: {
      iconClass: 'chart-bar',
      roles: ['admin', 'parentDuty'],
    }
  }
}, {
  path: '/courseChart',
  name: 'CourseChart',
  component: CourseChart,
  meta: {
    title: '选课报表',
    roles: ['admin', 'parentDuty'],
  }
},

{
  path: '/LeaveV2Detail',
  name: 'LeaveV2Detail',
  component: LeaveV2Detail,
  meta: {
    title: '请假详情',
    roles: ['admin', 'teacherDuty', 'studentDuty']
  }
}, {
  path: '/ApprovalV2Form',
  name: 'ApprovalV2Form',
  component: ApprovalV2Form,
  meta: {
    keepAlive: true,
    title: '请假审批',
    roles: ['admin', 'teacherDuty']
  }
}, {
  path: '/TeacherSelect',
  name: 'TeacherSelect',
  component: TeacherSelect,
  meta: {
    keepAlive: true,
    title: '选择教师',
    roles: ['teacherDuty', 'parentDuty', 'studentDuty', 'admin'],
  }
},
{
  path: '/LateInClassList',
  name: 'LateInClassList',
  component: LateInClassList,
  meta: {
    title: '晚归统计',
    // roles: ['teacherDuty', 'admin', 'suguanDuty'],
  }
}, {
  path: '/LateInDivisList',
  name: 'LateInDivisList',
  component: LateInDivisList,
  meta: {
    title: '晚归统计',
    // roles: ['teacherDuty', 'admin'],
  }
}, {
  path: '/LateInGradeList',
  name: 'LateInGradeList',
  component: LateInGradeList,
  meta: {
    title: '晚归统计',
    // roles: ['teacherDuty', 'admin'],
  }
},
{
  path: '/NotInList',
  name: 'NotInList',
  component: NotInList,
  meta: {
    title: '未归统计',
    // roles: ['teacherDuty', 'admin', 'suguanDuty'],
  }
}, {
  path: '/NotOutList',
  name: 'NotOutList',
  component: NotOutList,
  meta: {
    title: '未出统计',
    // roles: ['teacherDuty', 'admin', 'suguanDuty'],
  }
},

]

//不需要验证登陆路由白名单
export const NotLoginRouterMap = [
  {
    path: '/LateInReportMsg',
    name: 'LateInReportMsg',
    component: LateInReportMsg,
    meta: {
      title: '晚归记录',
      roles: ['teacherDuty', 'admin', 'studentDuty', 'suguanDuty'],
    }
  }, {
    path: '/NotInReportMsg',
    name: 'NotInReportMsg',
    component: NotInReportMsg,
    meta: {
      title: '未归记录',
      roles: ['teacherDuty', 'admin', 'studentDuty', 'suguanDuty'],
    }
  }, {
    path: '/NotOutReportMsg',
    name: 'NotOutReportMsg',
    component: NotOutReportMsg,
    meta: {
      title: '未出记录',
      roles: ['teacherDuty', 'admin', 'studentDuty', 'suguanDuty'],
    }
  }
]

export default new Router({
  routes: constantRouterMap
})
