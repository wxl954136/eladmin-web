<template>

  <el-dialog
    title="串号信息"
    v-loading="loading"
    :visible.sync="visible"
    width="600px"
    :before-close="modalClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div>
      <el-row :gutter="15">
        <el-col>
          <el-card class="box-card" shadow="hover" style = "margin-top: -30px;">
            <el-input placeholder="请输入内容" v-model="skuSelectData.sysSku.fullName" :disabled="true" style = "width:513px"  >
              <template slot="prepend">商品名称:</template>
            </el-input>
            <el-collapse  style = "border-top: 0px;border-bottom: 0px">
              <el-collapse-item title="串号规则设定:"  >
                  <template slot="title">
                    <el-badge :value="最多允许3个串号" class="item">
                      <el-button size="small" type="primary" style = "width:164px;" >串号规则设定<i class="el-icon-setting el-icon--right"></i></el-button>
                    </el-badge>
                  </template>
                  <el-table   :data="serialRuleData"
                              :show-header="false"
                              :cell-style="{padding:'3px'}"
                              align="center"
                              class = "tableNoneBrder"
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
                    <!--
                    <el-table-column  prop="rule"   width="50">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.enabled"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                        />
                      </template>
                    </el-table-column>
                    -->
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

            <el-table  :data="serialData"  style="width: 100%" max-height="250"
                       @selection-change='selectRow'
                       ref="serialInput"
                       :cell-style="{padding:'1px'}" class = "serialTableCellStyle">
              <el-table-column   type="selection" width="30" />
              <el-table-column label="ID"  type="index" width="40" align="center">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column  prop="serial01" label="串号(1)"     >
                <template slot-scope="scope">
                   <el-input v-model="scope.row.serial01"  size="mini"  placeholder="请按照规则录入" class="edit-input"  />
                </template>
              </el-table-column>
              <el-table-column  v-if="this.serialNum >=2" prop="serial02" label="串号(2)"    >
                <template slot-scope="scope">
                    <!--    https://www.bbsmax.com/A/gAJGmAmbdZ/  回车事件范例  -->
                  <el-input v-model="scope.row.serial02"  size="mini" class="edit-input" >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column   v-if="this.serialNum >=3" prop="serial03" label="串号(3)"   >
                <template slot-scope="scope">
                     <el-input v-model="scope.row.serial03"  size="mini" class="edit-input" />
                </template>
              </el-table-column>
            </el-table>

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
  export default {
    name:"serialInfo-son-compnent",
    data() {
      return {

        serialNum:1,
        serialLength:15,
        serialChecked:false,
        rules:[

        ],
        serialRuleData: [{
          rule: '15',
          enabled:true
        }
        ],
        serialSelectData:[],
        serialData: []
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
        this.$emit('fromSerialDlgGetData',"参数1","参数n",true)
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
        var list = {
          id: null,
          serial01:'',
          serial02:'',
          serial03:''
        }
        //this.serialData.unshift(list)
        this.serialData.push(list)
        this.$nextTick(() => {
            this.$refs.serialInput.bodyWrapper.scrollTop = this.$refs.serialInput.bodyWrapper.scrollHeight;
        })
      },
      //https://www.cnblogs.com/lhl66/p/10212624.html  删除选择数据的好方法
      handleTableSerailDel () {
        for (var i = this.$refs.serialInput.selection.length - 1; i >= 0; i--) {
          this.serialData.splice(this.$refs.serialInput.selection[i].index - 1, 1)
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

  .tableNoneBrder .el-table__row>td{
    border: none;
  }
  .tableNoneBrder .el-table::before {//去掉最下面的那一条线
    height: 0px;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
<style scoped>

</style>
