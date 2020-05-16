<template>
  <div id="profile" class="profile">
    
    <div>
      <!--我的-->
      <div class="avatar-content info-item clearfix">
        <div class="avatar">
          <font-awesome-icon v-if="avatar === null" size="lg" :icon="['far', 'user-circle']"/>
          <img v-if="avatar !== null" :src="fnGetImage()">
        </div>
        <div class="intro">
          <p class="name">{{userInfo.UserName}}</p>
          <p class="account">账号: {{userInfo.UserCode}}</p>
        </div>
      </div>
      <group gutter="0">
        <cell title="所属机构">
          <img
            slot="icon"
            style="margin-right:12px;vertical-align:middle"
            width="20"
            src="../../../../assets/icon/institutions.png"
            alt
          >
          <span>{{userInfo.OrgName}}</span>
        </cell>
        <cell v-if="accessRoleList.indexOf(userInfo.Duty)>-1&&currentClass.value" title="切换机构">
          <img
            slot="icon"
            style="margin-right:12px;"
            width="20"
            src="../../../../assets/icon/class.png"
            alt
          >
          <span>{{currentClass.value}}</span>
        </cell>
      </group>
      <group>
         <popup-radio
          v-if="accessRoleList.indexOf(userInfo.Duty)>-1 && currentClass.value"
          title="切换机构"
          @on-change="setCurrentObject"
          :options="classList"
          :model ="currentClass.key"
        ></popup-radio> 
        <!-- <cell
          v-if="userInfo.Duty === 'teacherDuty'"
          title="绑定班级"
          :is-link="true"
          :link="{path:'/TeacherBindClass'}"
        ></cell>  -->

        <!-- <x-switch @on-change="TOGGLE_NOTI_SOUND" title="消息提示音" :value="messageSound"></x-switch> -->
      </group>
    </div>
    <div v-show="showLogout" class="out-login">
      <X-button @click.native="Logout">退出登录</X-button>
    </div>
  </div>
</template>

<script>
import { getHonor, updateParentAvatar, GetBindClass ,restoreLogin} from "@/service";
import { mapGetters, mapActions, mapMutations } from "vuex";
import myUpload from "vue-image-crop-upload";
import {
  Flexbox,
  FlexboxItem,
  PopupPicker,
  Group,
  XButton,
  PopupRadio,
  Cell,
  Swiper,
  XSwitch
} from "vux";
import _ from "lodash";

export default {
  data() {
    return {
      honorList: [],
      show: false,
      showLogout: true,
      
    };
  },
  methods: {
    ...mapActions(["Logout"]),
    ...mapMutations(["SET_CURRENTOBJECT", "SET_AVATAR", "TOGGLE_NOTI_SOUND","SET_CURRENTCLASS"]),
    cropUploadSuccess(jsonData, field) {
      updateParentAvatar(this.userInfo.UserId, jsonData.filpath).then(res => {
        this.SET_AVATAR(jsonData.filpath);
      });
    },
    toggleCropper() {
      this.show = !this.show;
    },
    setCurrentObject(value) {
      console.log(value)

      let filterArray = this.classList.filter((item)=>item.key === value)
      this.SET_CURRENTCLASS(filterArray[0]);
    },
   
    fnGetImage() {
      if (process.env.NODE_ENV === "development") {
        return this.avatar;
      } else {
        return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${
          this.avatar
        }&time=${Math.random()}`;
      }
    },
    
  },
  components: {
    Flexbox,
    FlexboxItem,
    PopupPicker,
    Group,
    XButton,
    PopupRadio,
    Cell,
    Swiper,
    myUpload,
    XSwitch
  },
  mounted() {
    
    if(this.userInfo.Duty === 'studentDuty'){
      restoreLogin().then(res=>{      
        let temavatar = res.data.HeadIcon
        if(temavatar !== this.avatar){
          this.SET_AVATAR(temavatar);
        }
      })
    }    
  },
  computed: {
    ...mapGetters([
      "avatar",
      "name",
      "roles",
      "currentOb",
      "children",
      "userInfo",
      "messageSound",
      "bindClass",
      "currentClass"
    ]),
    accessRoleList(){
      return ['teacherDuty','studentDuty']
    },
    
    classList() {
      // let classArr = [{'Id':'6a969c9776f49142a30cfd5995e745a2','Name':'180941'},{'Id':'edf051e9d592594bb6ed9d3d6668c68d','Name':'180652'}]
      return _.map(this.bindClass, (item, i) => {
        return {
          value: item.Name,
          key: item.Id
        };
      });
    },
     childList() {
      if(this.children.length === 0||!this.children){return}
      return _.map(this.children, (item, i) => {
        return {
          value: item.studentName,
          key: item.id
        };
      });
    },
   
  }
};
</script>

<style lang="less">
.profile {
  
  background: #f0f0f0;
}
.info-item {
  display: flex;
  //border-bottom: 1px solid #e4e4e4;
  padding: 15px;
  line-height: 25px;
  background: #fff;
  .icon {
    color: #999999;
    float: left;
    width: 0.56rem;
    height: 0.56rem;
    margin-right: 0.293333rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    flex: 1;
    height: 15px;
    font-size: 0.4rem;
    line-height: 21px;
  }
  .sub-text {
    height: 14px;
    font-size: 0.373333rem;
    color: #808080;
    line-height: 21px;
  }
}
.avatar-content {
  padding: 15px;
  display: flex;
  background: #fff;
  .avatar {
    width: 1.48666667rem;
    height: 1.48666667rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      padding: 0.08rem;
      overflow: hidden;
      border: 1px solid #2eb1fd;
    }
    svg {
      font-size: 38px;
    }
  }
  .intro {
    height: 1.5rem;
    line-height: 0.55rem;
    margin-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-size: 0.42rem;
      font-weight: 500;
    }
    .account {
      margin-top: 4px;
      font-size: .36rem;
    }
    .motor,
    .account {
      color: #666;
    }
  }
}
.honor-content {
  width: 100%;
  float: left;
  .vux-swiper-desc {
    box-sizing: content-box;
  }
  img {
    width: 100%;
  }
}
.out-login {
  padding: 70px 15px;
  // margin-bottom: 70px;
  button {
    color: #ffffff;
  }
}

.vux-label,
.weui-label {
  font-size: 15px;
}
</style>
<style>
.weui-switch:checked{
  border-color: #2eb1fd !important;
  background-color:#2eb1fd !important;
}
 .weui-cells_radio{
  padding: 5px 0 !important;
}
</style>
