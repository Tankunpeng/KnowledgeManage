Vue.component("my-content",{
// 内容展示区域模板
  template:
    `
      <div>
      <template v-for="i in items">
        <span  :data-index = "i.index">
          <!-- tag名称 -->
          <span class="nam" v-on:click="showContent"
          style ="" >{{i.name}}</span>

          <!-- 编辑标签 -->
          <span  class = "edit" style = ""
          @click = "editItem">{{editText}}</span>

          <!-- 删除标签 -->
          <span class = "del" style = "display:none"
          @click = "deleItem">{{delText}}</span>

          <!-- tag内容 -->
          <pre class = "content" style = "display:none"
          :contenteditable="isEdit" @input="accelerator">{{i.content}}</pre>
        </span>
      </template>
      </div>
    `,

// 外部数据
  props:["items"],

// 组件内部数据
  data: function(){
      return {
        isDel: false,
        isEdit: false,
        editText: "修改",
        delText: "删除",
      }
    },
// 组件方法
  methods: {
    showContent: function(event){
      var ele = event.target
      var delE = ele.nextElementSibling;
      var modifyE = delE.nextElementSibling;
      var contentE = modifyE.nextElementSibling;
      var eleArr = [delE,modifyE,contentE]
      this.isEdit = this.isDel = false
      if(contentE.style.display==="none"){
          eleArr.forEach(function(ele,i){ele.style.display=i<2?"inline-block":"block"})
          ele.style.color = "#fff"
          ele.style.background = "#666"
      }
      else{
          eleArr.forEach(function(ele){ele.style.display="none"})
          ele.style.color = "#000"
          ele.style.background = "transparent"
      }
    },

    deleItem:function(event){
      if(this.isDel){
        this.isDel = false;
        var index = event.target.parentNode.dataset.index
        var item = this.items[index];
        this.$emit("del",item)
      }
      else{
        this.isDel = true;
      }
    },

    editItem:function(evt){
      //console.log(evt.target.innerText,this.isEdit)
      if(this.isEdit){
        this.isEdit = false
        this.editText = "编辑"
        // 保存最新的编辑
        var index = evt.target.parentNode.dataset.index
        var content= this.getItemContent(evt.target);
        var item = this.items[index];
        if(item.content!==content){
          this.$emit("edit",{'index':index,"content":content})
        }else{
          console.log("no change")
        }
        console.log(name,index,JSON.stringify(this.items[index]))
      }
      else{
        console.log("here")
        this.isEdit = true
        // 内容区域可编辑
        this.editText = "保存"
        var content = evt.target.nextElementSibling.nextElementSibling;
      }
    },

  getItemName:function(subEle){
    return subEle.parentNode.firstElementChild.innerText.trim()
  },

  getItemContent:function(subEle){
    return subEle.parentNode.lastElementChild.innerText
  },

  accelerator:function(evt){
      console.log("input",evt.target.innerText )
      var index = evt.target.parentNode.dataset.index
      //this.items[index].content = evt.target.innerText.trim()
  }

  } //END method
}) //END my-content


const defaultInput = "##  ##\n"
Vue.component("my-add-item",{
// 编辑区域模板
  template:
    `
      <div>
      <!-- 文本输入区 -->
      <textarea class="newitem" v-model="newitem"
       placeholder = "##title## content"
       style=""
       @keydown.enter="autoHeight">
       ##  ##

      </textarea>
      <!-- 添加按钮 -->
      <button class="addnew" v-on:click="add"
      style="">add</button>
      <!--div>{{newitem}}</div-->
      </div>
    `,

// 组件内部数据
  data:function(){
      return {
          newitem:defaultInput
      }
  },

// 组件方法
  methods: {
    // 添加新tag
    add : function(evt){
        console.log(this.newitem);
        this.$emit("add",this.newitem)
        this.newitem = defaultInput
    },
    // 自动设置文本框高度
    autoHeight : function(evt){
      evt.target.style.height=evt.target.scrollHeight+"px"
      console.log(evt.target,evt.target.scrollHeight)
    }
  }
}) // END



var app = new Vue({
// 实例绑定元素
  el:"#app",

// 实例数据
  data:{
      items:[{name:"TODO",content:""}
        ],
    },

// 计算属性
  computed:{
    todoBkg: function(){
      var item = this.items.filter(function(val,i){
        return val.name === "TODO"
        })
      return item.length?"TODO\n"+item[0].content:"no todo"
      }
  },

// Hook：xhr 获取服务器数据
  beforeCreate: function(){
    var self = this
    $.get("alldata",function(data){
      if(data){

        self.items= JSON.parse(data).map(function(val,index){
          var ret = JSON.parse(val)
          ret['index'] = index
          return ret
        })
        //console.log(JSON.stringify(self.items))
      }
      else{
        console.log("can't get data")
      }
    })
  },

// 实例方法
  methods:{
    // 添加新的内容
    additem: function(data){
        if(data === defaultInput) return
        console.log(data)
            itemRe = /^\s*##(.*\S.*)##\s*(\S[\s\S]*)$/m;
            res = data
                  ?data.match(itemRe)
                     ?data.match(itemRe).slice(1,3)
                     :false
                  :false;
            var newitem = {
                 name:res[0].trim(),
                 content:res[1].trim(),
                 index:this.items.length,
             }
            res&& this.items.push(newitem)
      // 将数据保存至服务器
      console.log("postdata",JSON.stringify(newitem),JSON.stringify(newitem).length)
      $.post("save",JSON.stringify(newitem),function(data){
      })
    },
    // 删除数据
    del: function(item){
      this.items.splice(item["index"],1)
      this.items = this.items.map(function(val,i,arr){
          if(val.index>item.index){
            val.index-=1
          }
          return val
      })
      // 提交数据
      $.post("del",JSON.stringify(item),function(data){
        console.log("callback",data,data.length)
      })
    },
    // 修改数据
    edit:function(item){
      this.items[item.index].content=item.content;
      // 提交数据
      $.post("saveEdit",JSON.stringify(this.items[item.index]),function(data){
        console.log("callback",data,data.length)
      })
    }
  }
})


// v- for语法错误　v-for="expression"
// template must have just one root & can't be <template>
// 更新动态的数组数据需要用到特殊数组方法
