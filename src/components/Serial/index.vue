<template>

  <el-dialog
    title="串号信息"
    :visible.sync="visible"
    width="600px"
    :before-close="modalClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div>
      <el-row :gutter="15">
        <el-col>
          <el-card class="box-card" shadow="hover" style = "margin-top: -30px;">
            <el-input placeholder="请输入内容" v-model="skuSelectData.sysSku.fullName + skuSelectData.keywords" :disabled="true" style = "width:513px"  >
              <template slot="prepend">商品名称:</template>
            </el-input>
            <el-collapse  style = "border-top: 0px;border-bottom: 0px">
              <el-collapse-item title="串号规则设定:"  >
                  <template slot="title">
                      <el-button size="small" type="primary" style = "width:164px;" >串号规则设定<i class="el-icon-setting el-icon--right"></i></el-button>
                  </template>
                  <el-table   :data="serialRuleData"
                              :show-header="false"
                              :cell-style="{padding:'3px'}"
                              align="center"
                              class = "tableNoneBorder"
                              ref = "serialRule"

                              style="width: 100%;border-bottom: 0px solid">
                    <el-table-column   type="index" width="60" align="center">
                      <template slot-scope="scope">
                        串号{{scope.$index + 1}}
                      </template>
                    </el-table-column>

                    <el-table-column  prop="rule"   width = "260" >
                      <template slot-scope="scope">
                           <el-input v-model="scope.row.rule" size="mini" class="edit-input"  />
                      </template>
                    </el-table-column>

                    <el-table-column  width = "120" >
                      <template slot-scope="scope">
                        <el-button type="primary" size = "mini" icon="el-icon-document-add" circle  @click.prevent = "handleTableRuleAdd"></el-button>
                          <!-- @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                        <el-button type="danger" size = "mini" icon="el-icon-delete" circle @click.prevent = "handleTableRuleDel(scope.$index)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-collapse-item>
            </el-collapse>
            <el-button-group style = "float:left">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click.prevent="handleTableSerialAdd()" >增加行</el-button>
              <el-button type="primary" size="mini"  @click.prevent="handleTableSerailDel()" >删除行<i class="el-icon-arrow-right el-icon-minus "></i></el-button>
            </el-button-group>

            <el-form :model="serialForm"  ref="serialForm"  :rules="serialForm.paramsRules" >
              <!--    :cell-style="{padding:'1px'}"  -->
                <el-table  :data="serialForm.params"  style="width: 100%" max-height="250"
                           @selection-change='selectRow'
                           ref="serialInput"
                           :cell-style="{padding:'1px'}"
                           class = "tableNoneBorder"
                          >
                  <el-table-column  type="selection"  :reserver-selection="true" width="35"   >

                  </el-table-column>
                  <el-table-column label="ID"  type="index" width="40" align="center">
                    <template slot-scope="scope">
                      <el-form-item>
                        {{scope.$index + 1}}
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column   label="串号(1)"    >
                    <template slot-scope="scope">
                      <el-form-item  :prop="'params.' + scope.$index + '.serial01'"  :rules="serialForm.paramsRules.serial01">
                          <el-input v-model="scope.row.serial01"   size="small"  placeholder="请按照规则录入" class="edit-input"  />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column  v-if="this.serialNum >=2"  label="串号(2)"    >
                    <template slot-scope="scope">
                      <el-form-item  :prop="'params.' + scope.$index + '.serial02'"  :rules="serialForm.paramsRules.serial02">
                           <el-input v-model="scope.row.serial02"  size="mini" class="edit-input"  />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column   v-if="this.serialNum >=3"  label="串号(3)"   >
                    <template slot-scope="scope">
                      <el-form-item  :prop="'params.' + scope.$index + '.serial03'"  :rules="serialForm.paramsRules.serial03">
                          <el-input v-model="scope.row.serial03"  size="small" class="edit-input" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
            </el-form>
          </el-card>
        </el-col>

      </el-row>

    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
  const paramesTemplate = {
    id: null,
    serial01: '',
    serial02: '',
    serial03: ''
  }
  export default {
    name:"serialInfo-son-component",
    data() {
      return {
        serialNum:1,
        serialLength:15,
        serialRuleData: [{
          rule: '15',
          enabled:true
        }],
        serialSelectData:[],
        serialForm:{
          //params: [ ], //Object.assign({},paramesTemplate)
          params: this.skuSelectData.bizTradeSerialFlow, //Object.assign({},paramesTemplate)
          paramsRules: {
            serial01: [{required: true, message: '请输入串号1', trigger: 'blur'}],
            serial02: [{required: true, message: '请输入串号2', trigger: 'blur'}],
            serial03: [{required: true, message: '请输入串号3', trigger: 'blur'}]
          }
        }
      }
    },

    props: {
      skuSelectData:{
         type:Object,
         required:true
      },
      visible: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      handleCancel(){
        this.visible = false
        this.modalClose()
      },
      handleConfirm(){
        console.log("lukeWang:子向父传数据,在父中间使用@fromSerialDlgGetData标识")
        this.$emit('fromSerialDlgGetData',this.serialForm.params,this.serialRuleData,true)
        this.visible = false
        this.modalClose()
      },
      modalClose() {
        //表示更新update:父件的visible属性
        this.$emit('update:visible', false); // 直接修改父组件的visible属性
      },
      selectRow (val) {
        this.serialSelectData = val

      },
      handleTableSerialAdd(){
        let data = Object.assign({},paramesTemplate) ; //复制并新建一个对象
        this.serialForm.params.push(data)
        this.$nextTick(() => {
            this.$refs.serialInput.bodyWrapper.scrollTop = this.$refs.serialInput.bodyWrapper.scrollHeight;
        })
      },
      //https://www.cnblogs.com/lhl66/p/10212624.html  删除选择数据的好方法
      handleTableSerailDel () {
        for (var i = this.$refs.serialInput.selection.length - 1; i >= 0; i--) {
          this.serialForm.params.splice(this.$refs.serialInput.selection[i].index - 1, 1)
        }
        this.$refs.serialInput.clearSelection()
      },
      handleTableRuleAdd(){
        var list = {
          rule: '15',
          enabled:true
        }
        if (this.serialRuleData.length >=3)  return
        this.serialRuleData.push(list)
        this.serialNum = this.serialRuleData.length
      },
      handleTableRuleDel(index){
        if (this.serialRuleData.length <=1)  return
        this.serialRuleData.splice(index, 1);
        this.serialNum = this.serialRuleData.length
      },
      inputQtyBlur(){
          if (this.serialLength > 30 )
          {
            this.serialLength = 30
            this.$notify.error({
              title: '错误',
              message: '串号长度最大允许30位'
            });;
          }
      },
      sonSupplyParent(){
        console.log("我是子组件里的方法，你能有效call到我,还未测试成功")
        alert("我是子组件里的方法，你能有效call到我")
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .number_input .el-input__inner{
    //border:none;
    //background: transparent;
    padding-right: 10px;
    text-align: right;
  }
  //调整checkBox布局，尽量协调
  /*
  .el-table th, .el-table td{
    vertical-align: text-top; //控制第一栏checkbox
  }
  .el-checkbox__inner{
    margin: 8px;
  }

   */
   .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 5px;
    padding-right: 5px;
  }


  .el-collapse-item__content {
    padding-bottom: 0px;
    font-size: 13px;
    line-height: 0;
  }

  .tableNoneBorder .el-table__row>td{
    border: none;
  }
  .tableNoneBorder .el-table::before {//去掉最下面的那一条线
    height: 0px;
  }





</style>
<style scoped>

</style>
