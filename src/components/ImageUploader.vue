<template>
  <div class="imageWrapper">
    <div class="title">
      <p>{{title}}</p>
      <span style="color:#ccc;">{{index}}/{{max}}</span>
    </div>
    <ul>
      <li class="imageList" v-for="(item,k) in uploadFiles" :key="k">
        <div class="uploaded-files">
          <div class="delete" @click="deleteItem(item)">X</div>
          <img class="preview" v-show="item.preview" :src="item.preview" alt="avatar">
        </div>
        <div class="fileName">{{item.fileName}}</div>
      </li>
    </ul>
    <div v-show="index < max " class="image">
      <label :for="wrapperId"></label>
      <input type="file" :accept="accept" :id="wrapperId" style="display:none" @change="upload">
      <div class="addfile"></div>
    </div>
    <div class="clear"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      previewId: "img",
      index: 0,
      uploadFiles: []
    };
  },
  props: {
    value: {
      type: Array
    },
    previewFormat:{
      required:false,
      type:Function || String,
    },
    max: {
      type: Number,
      required: false,
      default: 1
    },
    title: {
      type: String,
      required: false,
      default: "图片列表"
    },
    wrapperId: {
      type: String,
      required: false,
      default: "file"
    },
    accept: {
      type: String,
      required: false
    },
    action: {
      type: String,
      required: true
    }
  },

  methods: {
    //压缩图片
    fnCompress(file, zip, callback) {
      if (typeof FileReader === "undefined") {
        const path = window.URL.createObjectURL(file);
        document.querySelector(this.previewId).src = path;
        return;
      }
      try {
        let reader = new FileReader();
        reader.onload = function(e) {
          let image = document.createElement("img");
          image.onload = function() {
            var canvas = document.createElement("canvas"),
              context = canvas.getContext("2d"),
              imageWidth = 0, //压缩图片的大小
              imageHeight = 0,
              offsetX = 0,
              offsetY = 0,
              data = "";

            canvas.width = zip.width;
            canvas.height = zip.height;
            context.clearRect(0, 0, zip.width, zip.height);
            context.fillStyle = "#fff";
            context.fillRect(0, 0, zip.width, zip.height);

            if (this.width > this.height) {
              imageWidth = Math.round((zip.height * this.width) / this.height);
              imageHeight = zip.height;
              offsetX = -Math.round((imageWidth - zip.width) / 2);
            } else {
              imageHeight = Math.round((zip.width * this.height) / this.width);
              imageWidth = zip.width;
              offsetY = -Math.round((imageHeight - zip.height) / 2);
            }
            context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);

            data = canvas.toDataURL("image/jpeg");

            //压缩完成执行回调
            callback(data);
          };
          image.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (e) {
        console.log("压缩失败" + e);
      }
    },
    fnGetImage(src) {
      if (process.env.NODE_ENV === "development") {
        return `${src}`;
      } else {
        return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${src}&time=${Math.random()}`;
      }
    },
    //上传
    upload(e) {
      const file = e.target.files[0];
      const fileName = file.name;
      const fd = new FormData();
      fd.append("File", file);
      const _this = this
      const xhr = new XMLHttpRequest();
      xhr.open("post", _this.action);
      xhr.withCredentials = true;
      xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          // console.log(JSON.parse(xhr.response).url);
          _this.index += 1;
          _this.uploadFiles.push({
            fileName: fileName,
            preview:  _this.fnGetImage(JSON.parse(xhr.response).url),
            response:JSON.parse(xhr.response).url
          });
          _this.$emit("input", _this.uploadFiles);
        }
      };
      xhr.send(fd);
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
    deleteItem(value) {
      this.uploadFiles = this.uploadFiles.filter(item => item != value);
      this.$emit("input", this.uploadFiles);
      this.index--;
    }
  }
};
</script>
<style lang="less" scoped>
.imageWrapper {
  padding: 10px 15px;
  position: relative;
  & .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & .imageList {
    float: left;
    margin-top: 13px;
    margin-right: 0.5rem;
  }
  & .uploaded-files {
    position: relative;
    width: 50px;
    height: 50px;
  }
  & .delete {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
  }
  & .image {
    float: left;
    position: relative;
    width: 77px;
    height: 77px;
    border: 1px solid #ccc;
  }

  & label {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0;
    z-index: 9999;
  }
  & .preview {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
  }
  & .fileName {
    font-size: 12px;
    color: #666;
    max-width: 50px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.imageWrapper::before {
  content: "";
  position: absolute;
  top: 0;
  width: 100%;
  height: 1px;
  background: #ccc;
  transform: scaleY(0.5);
}
.fileName::hover {
  color: red;
  overflow: auto;
}
.addfile::before {
  position: absolute;
  content: "";
  width: 15px;
  height: 15px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}
.addfile::after {
  position: absolute;
  content: "";
  width: 15px;
  height: 15px;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
  left: 50%;
  top: 50%;
  transform: translate(-1px, -1px);
}
.clear {
  clear: both;
}
</style>


