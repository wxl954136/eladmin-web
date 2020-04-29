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
                      <el-button size="small" type="primary" round>串号规则设定<i class="el-icon-setting el-icon--right"></i></el-button>
                    </el-badge>
                  </template>
                  <el-table   :data="serialRuleData" :show-header="false"
                              align="center"
                              class = "tableNoneBrder"
                              style="width: 100%;border-bottom: 0px solid">
                    <el-table-column   type="index" width="60" align="center">
                      <template slot-scope="scope">
                        串号{{scope.$index + 1}}
                      </template>
                    </el-table-column>

                    <el-table-column  prop="rule"   width="260">
                      <template slot-scope="scope">
                           <el-input v-model="scope.row.rule" size="mini" class="edit-input"  />
                      </template>
                    </el-table-column>

                    <el-table-column  prop="rule"   width="100">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.enabled"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                        />
                        <!--  @change="changeEnabled(scope.row, scope.row.enabled)" -->

                      </template>
                    </el-table-column>

                    <el-table-column >
                      <template slot-scope="scope">
                        <el-button type="primary" size = "mini" icon="el-icon-document-add" circle></el-button>
                          <!-- @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                        <el-button type="danger" size = "mini" icon="el-icon-delete" circle></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-collapse-item>
            </el-collapse>

            <el-table  :data="serialData"  style="width: 100%" max-height="250">
              <el-table-column label="ID"  type="index" width="60" align="center">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column  prop="serial01" label="串号(1)"   width="150">  </el-table-column>
              <el-table-column  prop="serial02" label="串号(2)"   width="150">  </el-table-column>
              <el-table-column  prop="serial03" label="串号(3)"   width="150">  </el-table-column>
            </el-table>
<!--
            <el-input placeholder="请输入内容" v-model="serialNum" type="text" onkeyup="this.value=this.value.replace(/[^123]/g,'');" maxlength="1"  class = "number_input" style = "width:150px;">
              <template slot="prepend">串号个数:</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="serialLength" @blur = "inputQtyBlur" type="text" maxlength="2"  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"   class = "number_input" style = "width:150px;">
              <template slot="prepend">串号长度:</template>
            </el-input>
-->
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
        },{
          rule: '15',
          enabled:true
        },{
          rule: '15',
          enabled:true
        }
        ],
        serialData: [{
          serial01: '11111',
          serial02: '2222',
          serial03: '333'
        }]

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
        //this.$emit('update:visible', false)
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
