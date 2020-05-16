<template>
  <div class="setPhoto">
    <div class="wrapper">
      <modal-inline type="info" title="提示" text="持本人身份证到宿舍大厅自助机拍摄更换照片可立即生效,上传电子照片需等待管理人员审核"></modal-inline>
      <div class="take-photo">
        <div class="photo_wrap">
          <h1 style="text-align:center;fontSize:16px;padding:5px 0">当前照片</h1>
          <div style="width:100%;display:flex;justify-content:space-around;">
            <div class="photo" ref="photo">
              <div class="photo_file">
                
              </div>
              <p class="plustext">点击上传</p>
              <label for="file" class="plus"></label>
              <img src="@/assets/plus.png" class="plusImg"/>
              <div style="text-align:justify;height:100%">
                <!-- #2eb1fd -->
                <!-- <font-awesome-icon
                  v-show="!avatar"
                  size="lg"
                  :icon="['fa', 'camera']"
                  style="color:#2eb1fd"
                />-->
                <img ref="uploadimg" v-show="avatar&&fileList.length === 0" :src="fnGetImage()" />
                <img ref="preImg" v-show="fileList.length !== 0" />
              </div>
              <input
                id="file"
                ref="file"
                type="file"
                accept="image/*"
                @change="change"
                style="display:none;"
              />
            </div>
            <!-- SystemManage/CurrentUser/GetImg -->
            <!-- <div style="width:100px;height:150px;">
                  <img ref="uploadimg" :src="fnGetImage()" style="width:100px;height:150px;" />
            </div>-->
          </div>
        </div>
        <div style="margin-top:.5rem;text-align:left;">
          <div v-if="!Uploaded" style="color:#333;">
            <p>1.经常带眼镜的同学无需摘下眼镜</p>
            <p>2.头部占照片尺寸的2/3,人像清晰无遮挡</p>
          </div>
        </div>
      </div>
      <!-- v-if="reject" -->
      <div style="paddingTop:10px">
        <modal-inline v-if="modalShow" :type="statusType" :title="statusTitle" :text="statusText"></modal-inline>
      </div>

      <div class="btn" v-if="!isSubmit">
        <x-button @click.native="fnGetInfo">提交审核</x-button>
      </div>
      <!--  -->
      <div v-if="isSubmit" style="paddingTop:10px">
        <modal-inline type="warn" title="你已提交新的照片审核" :text="submitText"></modal-inline>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton } from "vux";
import Uploader from "@/components/Uploader/Uploader";
import { updatePhoto ,getStatusByStudent} from "@/service";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Exif from "exif-js";
import ModalInline from "@/components/ModalInline.vue";
import moment from "moment";

export default {
  data() {
    return {
      fileList: [],
      originfile: Object,
      Uploaded: false,
      tips: "上传成功",
      tobe: "",
      isSubmit: false,
      Orientation: 0,
      submitText: "",
      reject: false,
      statusType:'cancel',
      statusTitle:'',
      statusText: "",
      modalShow:false,
    };
  },
  computed: {
    ...mapGetters(["avatar","photoStatus"])
  },
  methods: {
    ...mapMutations(["SET_AVATAR"]),
    fnGetInfo() {
      if (!this.originfile.type) {
        this.$vux.toast.show({
          text: "未选择图片",
          type: "warn"
        });
        return;
      }
      const that = this;
      const fzip = {
        width: 358,
        height: 411
      };
      let ofile = this.originfile.type;
      let imgType = ofile.substring(ofile.indexOf("/") + 1);

      this.compress(that.originfile, fzip, this.Orientation, function(
        imgBase64
      ) {
        that.tobe = imgBase64;
        const fd = new FormData();
        let ourl = that.avatar;
        // ourl = reg1.test(ourl)?ourl.replace(reg1,''):ourl

        fd.append("SubmitImg", ourl);
        fd.append("file", that.dataURLtoFile(imgBase64, "aaa." + imgType));
        fd.append("ApplicantId", that.userInfo.UserId);
        fd.append("flag", 1);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        that.$vux.loading.show({
          text: "正在提交申请..."
        });
        // console.log(fd)
        setTimeout(() => {
          // ${that.GLOBAL.API_HOST}
          xhr.open("post", `${that.GLOBAL.API_HOST}/Dorm/Face/Apply`);
          xhr.upload.onerror = function() {
            that.$vux.loading.hide();
            that.tips = "提交失败";
          };
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
              let res = JSON.parse(xhr.response);

              if (res.state === "success") {
                that.Uploaded = true;
                that.$vux.loading.hide();
                that.submitText = `提交时间:${moment().format(
                  "YYYY-MM-DD HH:mm"
                )}`;
                that.tips = "提交成功!";
                that.isSubmit = true;

                // setTimeout(function() {
                //   that.$router.push("/PhotosList");
                // }, 1000);
              } else {
                that.$vux.loading.hide();
                that.$vux.toast.show({
                  text: "上传失败，重新选择",
                  type: "warn"
                });
                that.tips = "上传失败!";
              }
            }
          };

          xhr.send(fd);
        }, 3000);
      });
    },
    // imgLoad(e){
    //   console.log('ll',e)
    //    e.target.src = require('@/assets/icon/ApprovalV2.png')
    // },
    fnGetImage() {
      
      return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${
        this.avatar
      }&time=${Math.random()}`;
      // return this.avatar
      
    },

   

    change(e) {
      var _this = this;
      const file = e.target.files[0];
      this.originfile = file;
      var Orientation;

      let imgBase64 = "";
      if (!file) {
        return;
      }

      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
        _this.Orientation = Orientation;
        const zip = {
          width: 100,
          height: 150
        };

        _this.compress(file, zip, Orientation, function(imgBase64) {
          imgBase64 = imgBase64; //存储转换的base64编码
          _this.$refs.preImg.src = imgBase64;
          _this.fileList = e.target.files;
        });
      });
    },
    // 图片压缩
    compress(fileObj, zip, Orientation, callback) {
      var _this = this;

      if (typeof FileReader === "undefined") {
        console.log("当前浏览器内核不支持base64图标压缩");
        //调用上传方式不压缩
        // directTurnIntoBase64(fileObj, callback);
      } else {
        try {
          let reader = new FileReader();

          reader.onload = function(e) {
            let image = document.createElement("img");
            image.onload = function() {
              //定义画布的大小，也就是图片压缩之后的像素
              var square = {
                  width: zip.width,
                  height: zip.height
                },
                canvas = document.createElement("canvas"),
                context = canvas.getContext("2d"),
                imageWidth = 0, //压缩图片的大小
                imageHeight = 0,
                offsetX = 0,
                offsetY = 0,
                data = "";

              canvas.width = square.width;
              canvas.height = square.height;
              context.clearRect(0, 0, square.width, square.height);
              context.fillStyle = "#fff";
              context.fillRect(0, 0, square.width, square.height);

              if (this.width > this.height) {
                imageWidth = Math.round(
                  (square.height * this.width) / this.height
                );
                imageHeight = square.height;
                offsetX = -Math.round((imageWidth - square.width) / 2);
              } else {
                imageHeight = Math.round(
                  (square.width * this.height) / this.width
                );
                imageWidth = square.width;
                offsetY = -Math.round((imageHeight - square.height) / 2);
              }
              if (Orientation == 6) {
                context.rotate((90 * Math.PI) / 180);
                imageHeight = imageHeight * -1;
                if (square.height == 150) {
                  offsetX = -square.height * 0.18;
                  offsetY = square.height * 0.18;
                } else {
                  // offsetX = square.height * 0.18;
                  offsetY = 150 * 0.18;
                }
              }

              context.drawImage(
                this,
                offsetX,
                offsetY,
                imageWidth,
                imageHeight
              );
              data = canvas.toDataURL("image/jpeg");

              //压缩完成执行回调
              callback(data);
            };
            image.setAttribute("src", e.target.result);
          };
          reader.readAsDataURL(fileObj);
        } catch (e) {
          console.log("压缩失败!");
          //调用直接上传方式 不压缩
          // directTurnIntoBase64(fileObj, callback);
        }
      }
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    setStudentStatus(){
      let photoStatus = this.photoStatus
      // console.log(photoStatus)
      if(photoStatus.statusType){
        this.modalShow = true
        this.statusType = (photoStatus.statusType===-1?'cancel':'warn')||'warn'
        this.statusText = photoStatus.message
        this.statusTitle = photoStatus.message

      }else{
        this.modalShow = false
      }
    }

  },
  mounted() {
    // console.log(this.photoStatus)
    this.setStudentStatus()
    // this.getStatusByStudent()
  },
  // beforeRouteEnter(to,from,next){
  //   // getStatusByStudent(this.userInfo.UserId)
    
  //   getStatusByStudent().then(res=>{
  //     // console.log('rrr',res.data.data)
  //     let st = res.data.data.statusType
  //     let statusType = 'warn'
  //     if(st === '-1'){
  //       statusType = 'cancel'
  //     }
  //     let statusText = res.data.data.message
  //     next(vm => vm.setStudentStatus(statusType, statusText))
  //   })

  // },
  components: {
    XButton,
    Uploader,
    ModalInline
  }
};
</script>
<style lang="less" scoped>
.setPhoto {
  padding: 0 10px;
  position: relative;
}

.wrapper {
  width: 100%;

  padding-top: 10px;
  // flex: 1;
  background: #fff;
}
.wrapper-content {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.wrapper-img-take {
  width: 100%;
  flex: 1;
}
.take-photo {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.photo_wrap {
  width: 100%;
}
.photo {
  position: relative;
  width: 160px;
  height: 200px;
  background: #f6f6f6;
  text-align: center;
  
}
.plus ,.plusImg{
  width: 60px !important;
  height: 60px !important;
  // border: 3px solid #fff;
  position: absolute;
  line-height: 60px;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  // border-radius: 10px;
  // z-index: 101;
  // font-size: 18px;
}
.plus{
  z-index: 101;
}
.plusImg{
  z-index: 100;
  opacity:0.5;
}

.photo img {
  width: 100%;
  height: 100%;
  // border: 1px solid #2eb1fd;
}
.photo .photo_file {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.plustext {
  color: #fff;
  font-size: 20px;
  position: absolute;
  bottom:15px;
  width: 100%;
  text-align: center;
  z-index: 101;
  opacity: .5;
}
.icon-red {
  color: #ccc;
}
/* .photo img{
  width: 100%;
  height:100%;  
  
} */

.corner {
  position: absolute;
  /* top: 0;
  width: 10px;
  height: 1px; */
  background: #333;
}

.wrapper-item {
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
}
.wrapper-item input {
  width: 80%;
  height: 1.5rem;
  border: none;
  padding-left: 0.7rem;
}
.wrapper-item img {
  width: 0.45rem;
  vertical-align: middle;
}
.btn {
  margin-top: 20px;
  width: 100%;
}
.btn button {
  /* background: -o; */
  background: #2eb1fd;
  color: #fff;
}
</style>


