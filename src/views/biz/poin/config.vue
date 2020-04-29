<template>
  <div class="app-container" >
    <el-row :gutter="15">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="78px">
      <el-col>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix" >
            <!--
            <span class="role-span">订单信息</span>
            -->

            <el-button-group style = "float: left">
              <el-button type="primary" size="mini" icon="el-icon-arrow-left">上一页</el-button>
              <el-button type="primary" size="mini">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              <el-button  :loading="saveLoading"  icon="el-icon-check"   size="mini" type="primary"  @click="doSubmit">保存</el-button>
            </el-button-group>

          </div>
            <el-row :gutter="3">
              <el-col :span="6">
                <el-form-item label="单据编号" prop="bizNo"  >
                  <el-input v-model="form.bizNo" style="width: 180px;" :disabled = "true" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据日期" prop="bizDate">
                  <el-date-picker
                    v-model="form.bizDate"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 180px;"
                    >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="3">
              <el-col :span="6">
                <el-form-item label="往来单位" prop="sysTrader.id" :rules="rules.sysTrader">
                  <el-select v-model="form.sysTrader.id"  filterable  clearable placeholder="请选择"  style="width: 180px">
                    <el-option
                      v-for="item in tradersData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库仓位" prop="sysStore.id">
                  <el-select v-model="form.sysStore.id"  filterable  clearable placeholder="请选择"  style="width: 180px">
                    <el-option
                      v-for="item in storesData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="付款方式" prop="payMethod">
                  <el-select v-model="form.payMethod"  filterable  clearable placeholder="请选择"  style="width: 180px">
                    <el-option
                      v-for="item in payMethodData"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="3">
              <el-col :span="6">
                <el-form-item label="经手人" prop="handler">
                  <el-input   v-model="form.handler"  style="width: 180px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">

                  <el-input   type = "textarea" v-model="form.remark"
                              :autosize="{ minRows: 2, maxRows: 3}"
                  >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
              </el-col>

            </el-row>

        </el-card>
      </el-col>
      <el-col style="margin-bottom: 10px">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <!--
            <span class="role-span">商品信息：</span>
            -->
            <el-button-group style = "float:left">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click.prevent="handleTableAdd()">增加行</el-button>
              <el-button type="primary" size="mini" @click.prevent="handleTableDel()">删除行<i class="el-icon-arrow-right el-icon-minus "></i></el-button>
            </el-button-group>
          </div>

          <el-table  v-loading="loading"
                     element-loading-text="正在努力加载，请稍候"
                     element-loading-spinner="el-icon-loading"
                     :data="data"
                     :max-height="tableHeight" size="small"
                     @selection-change='selectRow'
                     style="width: 100%;margin-bottom: 15px">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号"  type="index" width="60" align="center"></el-table-column>
            <el-table-column   label="商品名称" width="250">
              <template slot-scope="scope">
                <el-select v-model="scope.row.sysSku.id"  filterable  clearable placeholder="请选择"  style="width: 240px" >
                  <el-option
                    v-for="item in skuDatas"
                    :key="item.id"
                    :label="item.fullName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column  label="数量" width="90">
              <template slot-scope="scope">
                <el-input v-model="scope.row.qty"  size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column prop="price" label="单价" width="90">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"  size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="税率" width="90">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rate"  size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column  label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" size="mini" class="edit-input" />
              </template>
            </el-table-column>
            <el-table-column label="串码详情" width="90" align = "center">
              <template slot-scope="scope">
                <div v-if = scope.row.sysSku.costFlag>
                  <a  @click="operatorSerialInfo(scope.row)"><i class="el-icon-folder-add el-icon--right"></i>详情</a>

                  <!--
                  <router-link :to="'/po/poin/config/' + 'add'">
                    <i class="el-icon-folder-add el-icon--right"></i>详情
                  </router-link>
                  -->
                </div>
              </template>
            </el-table-column>

          </el-table>
          <!--lukeWang:串号信息Dlg做为公共组件封装引入,注意父子传值方法-->
          <!--lukeWang:父传子方法:https://blog.csdn.net/qq_34928693/article/details/80539350 -->
          <serialInfo ref="serialInfo" @fromSerialDlgGetData="parentSupplySon"
                      v-bind:skuSelectData="skuSelectData"
                      v-if="serialInfoVisible" :visible.sync="serialInfoVisible">
          </serialInfo>
        </el-card>
      </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import crud from '@/mixins/crud'
  import {  get ,add , update} from '@/api/biz/bizPoInConfig'
  import { getSysTraders } from '@/api/system/sysTrader'
  import { getStores } from '@/api/system/store'
  import { getSkus } from '@/api/system/sku'
  import { getSysConst } from '@/api/system/sysConst'

  import SerialInfo from '@/components/Serial'

  export default {
    name: 'BizPoInConfig',
    components: {
      'SerialInfo':SerialInfo  //串号信息做为一个公共组件
    },
    mixins: [crud],
    data() {
      return {
        payMethodData:[{value:1,name:"现金"},{value:2,name:"应付款"}],
        serialInfoVisible:false,
        poId: '',
        tableHeight: 450,
        saveLoading: false,
        tradersData: [],
       // sysConstData:[],
        storesData:[],
        selectDetailRows:[],
        skuDatas:[],
        skuSelectData:[],

        form: {
          id: null,
          bizNo:'',
          payMethod:1,
          bizDate:'',
          bizPoInDetails:{id:null},
          sysStore:{id:null},
          sysTrader:{id:null},
          handler:'',
          remark:'',
          isDelete:0,
          version:0,
          topCompanyCode:''
        },
        rules: {
          handler: [
            { required: true, message: '请输入经手人', trigger: 'blur' }
          ],
          sysTrader: { required: true, message: '请选择往来单位', trigger: 'select' }
        }
      }
    },
    beforeCreate(){

    },
    created() {
      this.tableHeight = document.documentElement.clientHeight - 385
      this.poId = this.$route.params.poId
      this.getSysTradersInfo()
     // this.getSysConstInfo()
      this.getStoresInfo()
      this.getSkusInfo()
      this.$nextTick(() => {
          if (this.poId > 0 ) this.getBizNoteInfo()
      })
    },

    mounted(){

      //一定要加此判断 ，否则table加载数据时，不停的加载
      if (parseInt(this.poId) == -1){
        //this.handleTableAdd()
        this.loading = false
      }
    },
    methods: {
      getBizNoteInfo(){
        get(this.poId).then(data => {
          this.form = data
          this.data = this.form.bizPoInDetails  //this.data,来自于crud.js中的定义
          this.loading = false
        })
      },
      getSysConstInfo(){
        getSysConst({type:"PAYABLE"}).then(res => {
          this.sysConstData = res;
        })
      },
      getSysTradersInfo() {
        getSysTraders({ salerFlag: true }).then(res => {
          this.tradersData = res.content
        })
      },
      getStoresInfo() {
        getStores({ enabled: true }).then(res => {
          this.storesData = res.content
        })
      },
      getSkusInfo() {
        getSkus({ enabled: true }).then(res => {
          this.skuDatas = res.content
        })
      },
      operatorSerialInfo(obj){
      // alert("c---" + obj.sysSku.fullName)
        console.log("取行传值方法范本：" + obj.sysSku.fullName)
        this.serialInfoVisible = true
        this.skuSelectData = obj
        //this.$refs.serialInfo.skuFullName = obj.sysSku.fullName

      },
     selectRow (val) {
        this.selectDetailRows = val
      },
      // 删除选中行
      handleTableDel () {
        for (let i = 0; i < this.selectDetailRows.length; i++) {
          let val = this.selectDetailRows
          val.forEach((val, index) => {  //选中的数据集合
            this.data.forEach((v, i) => {   //所有明细集合
              if (val.id === v.id) {
                this.data.splice(i, 1)  //1表示删除一整个对象
              }
            })
          })
        }
        // 删除完数据之后清除勾选框
       this.$refs.data.clearSelection()
      },
      handleTableAdd(){
        var list = {
          id: null,
          headId:  null　,
          sysSku:{
            id: null,
            fullName: "",
            costFlag: true
          },
          qty:1,
          price:0,
          rate:0,
          version:0,
          remark:'',
          isDelete:false
        }
        this.data.unshift(list)
      },
      doSubmit(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading=true
            //新增
            if (this.poId == -1  ||  this.poId == null){
              this.form.bizPoInDetails = this.data
              add(this.form).then(res => {
                this.notify('保存成功', 'success')
                this.poId = res.id
                this.getBizNoteInfo()
                this.saveLoading=false
              }).catch(err => {
                this.saveLoading = false
                console.log(err.response.data.message)
              })
            }else {
              //修改
              update(this.form).then(res => {
                this.getBizNoteInfo()
                this.notify('保存成功', 'success')
                this.saveLoading=false
              }).catch(err => {
                this.saveLoading = false
                console.log(err.response.data.message)
              })
            }
          }
        })
      },
      parentSupplySon(param1,param2,param3){
        console.log("子组件调用父组件开辟指明Method")
        alert("1--父组件里的方法---:" + param1 + "&&&:" + param2 + "   " + param3)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .edit-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
