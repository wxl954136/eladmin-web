<template>
  <div class="app-container" >
    <el-row :gutter="15">
      <!-- lukeWang:这里千万能设置 label-width="" 否则表格中间的布局会乱掉-->
      <el-form ref="formRef" :model="poinForm" :rules="rules" size="small"  >
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
                  <el-input v-model="poinForm.bizNo" style="width: 180px;" :disabled = "true" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据日期" prop="bizDate">
                  <el-date-picker
                    v-model="poinForm.bizDate"
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
                  <el-select v-model="poinForm.sysTrader.id"  filterable  clearable placeholder="请选择"  style="width: 180px">
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
                  <el-select v-model="poinForm.sysStore.id"  filterable  clearable placeholder="请选择"  style="width: 180px">
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
                  <el-select v-model="poinForm.payMethod"  filterable  clearable placeholder="请选择"  style="width: 180px">
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
                  <el-input   v-model="poinForm.handler"  style="width: 180px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">

                  <el-input   type = "textarea" v-model="poinForm.remark" style="width: 280px"
                              :autosize="{ minRows: 1, maxRows: 3}"
                  >

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
                       :data="poinForm.bizPoInDetails"
                       ref = "poinDetailRef"
                       :max-height="tableHeight"
                       @selection-change='selectRow'
                       :default-sort = "{prop: 'id', order: 'descending'}"
                       style="width: 100%">
              <el-table-column type="selection" width = "40" align="center"></el-table-column>
              <!--<el-table-column label="序号"  type="index"  width = "50" align = "center" >--->
              <el-table-column label="序号"     width = "50" align = "center" >
                <template slot-scope="scope">
                    <el-form-item>
                        {{scope.$index + 1}}
                    </el-form-item>
                </template>
              </el-table-column>
              <el-table-column   label="商品名称"  width = "245" >
                <template slot-scope="scope">
                  <el-form-item  :prop="'bizPoInDetails.' + scope.$index + '.sysSku.id'"  >
                    <el-select v-model="scope.row.sysSku.id"  filterable  clearable placeholder="请选择"  style="width: 240px" >
                      <el-option
                        v-for="item in skuDatas"
                        :key="item.id"
                        :label="item.fullName"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column  label="数量"   width = "80" align="right">
                <template slot-scope="scope">
                  <el-form-item  :prop="'bizPoInDetails.' + scope.$index + '.qty'" :rules="rules.qty" >
                     <el-input v-model="scope.row.qty"  size="mini" class="number-input" />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="price" label="单价" width="80" align="right">
                <template slot-scope="scope">
                  <el-form-item :prop="'bizPoInDetails.' + scope.$index + '.price'" :rules="rules.price">
                    <el-input v-model="scope.row.price" size="mini" class="number-input"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="总额" width="100" align="right">
                <template slot-scope="scope">
                  <el-form-item>
                    <i class="el-icon-money"></i>{{ parseFloat(scope.row.qty * scope.row.price).toFixed(AMOUNTDIGIT)}}
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="税率" width="80" align="right">
                <template slot-scope="scope">
                  <el-form-item :prop="'bizPoInDetails.' + scope.$index + '.rate'" :rules="rules.rate">
                    <el-input v-model="scope.row.rate" size="mini" class="number-input"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="总额(含税)" width="100" align="right">
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="scope.row.rate == 0">
                      <div><i class="el-icon-money"></i> {{ parseFloat(scope.row.qty
                        *scope.row.price).toFixed(AMOUNTDIGIT)}}
                      </div>
                    </div>
                    <div v-else>
                      <div><i class="el-icon-money"></i>{{ parseFloat(scope.row.qty * scope.row.price - scope.row.qty *
                        scope.row.price* scope.row.rate /100).toFixed(AMOUNTDIGIT)}}
                      </div>
                    </div>
                  </el-form-item>
                </template>

              </el-table-column>

              <el-table-column label="备注" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'bizPoInDetails.' + scope.$index + '.remark'">
                    <el-input v-model="scope.row.remark" size="mini"/>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="串码详情" align = "center">
                <template slot-scope="scope">
                  <el-form-item>
                  <div v-if = scope.row.sysSku.costFlag>
                      <a  @click="operatorSerialInfo(scope.row,scope.$index)"><i class="el-icon-folder-add el-icon--right"></i>详情</a>
                      <!--
                      <router-link :to="'/po/poin/config/' + 'add'">
                        <i class="el-icon-folder-add el-icon--right"></i>详情
                      </router-link>
                      -->
                    </div>
                  </el-form-item>
                </template>

              </el-table-column>

            </el-table>
            <!--lukeWang:串号信息Dlg做为公共组件封装引入,注意父子传值方法-->
            <!--lukeWang:父传子方法:https://blog.csdn.net/qq_34928693/article/details/80539350 -->
            <serialInfo ref="serialInfo" @fromSerialDlgGetData="parentCallSonGetSerialInfo"
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
  import {add, get, update} from '@/api/biz/bizPoInConfig'
  import {getSysTraders} from '@/api/system/sysTrader'
  import {getStores} from '@/api/system/store'
  import {getSkus} from '@/api/system/sku'
  import {getSysConst} from '@/api/system/sysConst'
  import SerialInfo from '@/components/Serial'
  import {uuid} from 'vue-uuid' // Import uuid
  import {validatePrice} from '@/utils/validate'


  const bizPoInDetailsTemplate = {
    id: null,
    keywords: '',
    headId: null,
    bizType: 'PI',
    sysSku: {
      id: null,
      fullName: '',
      costFlag: true
    },
    bizTradeSerialFlow:[],  //串号数据集合
    qty: 1,
    price: 0,
    rate: 0,
    version: 0,
    remark: '',
    isDelete: false
  }
  const poinFormTemplate = {
    id: null,
    bizNo: '',
    payMethod: 1,
    bizDate: '',
    bizPoInDetails: [],
    sysStore: {id: null},
    sysTrader: {id: null},
    handler: '',
    remark: '',
    isDelete: 0,
    version: 0,
    topCompanyCode: ''
  }
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
        tableHeight: 350,
        saveLoading: false,
        tradersData: [],
        // sysConstData:[],
        storesData:[],
        selectDetailRows:[],
        skuDatas:[],
        skuSelectData:null,
        poinForm: poinFormTemplate,
        rules: {
          handler: [
            { required: true, message: '请输入经手人', trigger: 'blur' }
          ],
          sysTrader: { required: true, message: '请选择往来单位', trigger: 'select' },
          price:[
            {required: true,message: '单价必填', trigger: 'blur'},
            { validator: validatePrice, min:0,trigger: 'change' }  //切记，自定validate，任何时候必须回调callback,否则validate失效
            ],
          qty:{required: true, message: '数量必填',trigger: 'blur'},
          rate:{required: true, message: '税率必填',trigger: 'blur'}
          //https://blog.csdn.net/sinat_41200024/article/details/88352742  里面有自定义规则
        }
        /*,
        var isPriceVlidator= (rule, value, callback) => {
          var pattern = /^\d+.?\d{0,2}$/;
          if(value > 214748){
            return callback(new Error('销售报价金额过大’))
          }else if (value <= 214748 && !pattern.test(value)) {
            return callback(new Error(‘小数点后最多只能输入两位’))
          }else return callback()
        }
         */
      }
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
        this.initBizNoteInfo()
        this.loading = false

      }
    },
    methods: {
      initBizNoteInfo(){
        //相应的值进行初始化，否则数据会有残留 ，如新建时，二次新建时会代入一次的值
        let skuData = Object.assign({},bizPoInDetailsTemplate.sysSku)
        let detailData = Object.assign({},bizPoInDetailsTemplate) ; //复制并新建一个对象
        detailData.sysSku = skuData
        let initData = Object.assign({},poinFormTemplate) ; //复制并新建一个对象
        initData.sysStore.id = null
        initData.sysTrader.id = null
        initData.bizPoInDetails = []
        initData.bizPoInDetails.push(detailData)
        this.poinForm = initData
      },
      getBizNoteInfo(){
        get(this.poId).then(data => {
          this.poinForm = data
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
      operatorSerialInfo(obj,index){
        if (obj.sysSku.id == null ) return
        let sku = {};
        sku = this.skuDatas.find((item)=>{
          return item.id === obj.sysSku.id ;
        });
        obj.sysSku.fullName = sku.fullName
        console.log("取行传值方法范本：" + obj.sysSku.fullName)
        this.skuSelectData = obj
       // alert(this.skuSelectData.sysSku.fullName + "-----" + this.skuSelectData.bizTradeSerialFlow.length)
        this.serialInfoVisible = true
      },
      selectRow (val) {
        this.selectDetailRows = val
      },
      // 删除选中行
      handleTableDel () {

        for (var i = this.$refs.poinDetailRef.selection.length - 1; i >= 0; i--) {
          this.poinForm.bizPoInDetails.splice(this.$refs.poinDetailRef.selection[i].index - 1, 1)
        }
        // 删除完数据之后清除勾选框
        this.$refs.poinDetailRef.clearSelection()
      },
      handleTableAdd(){
        console.info("调用uuid方法:" + uuid.v1())
        let data = Object.assign({},bizPoInDetailsTemplate) ; //复制并新建一个对象
        let skuData = Object.assign({},bizPoInDetailsTemplate.sysSku)
        data.sysSku = skuData
        this.poinForm.bizPoInDetails.push(data)
        this.$nextTick(() => {
          this.$refs.poinDetailRef.bodyWrapper.scrollTop = this.$refs.poinDetailRef.bodyWrapper.scrollHeight;
        })
      },
      doSubmit(){
        this.$refs['formRef'].validate((valid) => {
          if (valid) {
            this.saveLoading=true
            //新增
            if (this.poId == -1  ||  this.poId == null){
              add(this.poinForm).then(res => {
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
              update(this.poinForm).then(res => {
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
      parentCallSonGetSerialInfo(serialData,serialRuleData,param3){
        console.log("子组件调用父组件开辟指明Method")
       // alert(serialData.size() + "-----------1")

     //   alert("1--父组件里的方法---:"  + result + "   " + param3)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .number-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
      text-align:right;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
