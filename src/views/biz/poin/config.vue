<!--
问题:
1.为什么明细更新后，会更新skuDatas的值，造成el-select值重复



-->

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
                    :picker-options="pickerDateOptions"
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
                    <!--
                    <el-form-item  :prop="'bizPoInDetails.' + scope.$index + '.sysSku.id'"  >
                    <el-select v-model="scope.row.sysSku.id"  filterable  clearable placeholder="请选择"   @change="changeSysSkuItem(scope.row)" style="width: 240px" >
                    https://www.jianshu.com/p/5fc946a52f56


                    -->
                    <el-select   v-model="scope.row.sysSku.id"   filterable  clearable placeholder="请选择"
                                 @change="changeSysSkuItem(scope.row)" style="width: 240px"
                                 :disabled="scope.row.id != null ?true:false"
                    >
                      <el-option  v-for="item in skuDatas"  :key="item.id"  :label="item.fullName"  :value="item.id" >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
F
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
                    <div v-if = "scope.row.sysSku.costFlag == 1">
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
                        v-bind:currentSelectTarget="currentSelectTarget"
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
  import {parseTime} from "../../../utils";

  //用于保存串号里面的信息，key: 明细中的keywords,value是串号模板中的对象
  const mapPoInSerial = new Map()

  //注意，keywords:当主表时可以初始化uuid.v1(),但是当明细表时，必须在新增明细时给uuid,否则多次增加会取初始化值（一直相同）
  const bizPoInDetailsTemplate = {
    id: null,
    keywords: null,
    headId: null,
    bizType: 'PI',
    sysSku: {
      id: null,
      fullName: '',
      costFlag: null
    },
    bizTradeSerialFlow:[],  //串号数据集合
    qty: 1,
    price: 0,
    rate: 0,
    version: 0,
    remark: '',
    isDelete: false,
    topCompanyCode: ''
  }

  const poinFormTemplate = {
    id: null,
    keywords: uuid.v1(),
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
        saveLoading: false,  //保存时加载
        tradersData: [],
        // sysConstData:[],
        storesData:[], //仓库数据
        selectDetailRows:[],  //明细选择行的数据集合
        skuDatas:[],
        currentSelectTarget:null, //就是商品明细
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
        },
        pickerDateOptions: {
          disabledDate: (time) => {
            // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
            return this.dealDisabledDate(time);
          }
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
        let skuData = Object.assign({},bizPoInDetailsTemplate.sysSku) //复制结构并新建一个对象
        let detailData = Object.assign({},bizPoInDetailsTemplate) ; //复制并新建一个对象
        detailData.keywords = uuid.v1();
        detailData.sysSku = skuData
        let initData = Object.assign({},poinFormTemplate) ; //复制并新建一个对象
        initData.sysStore.id = null
        initData.sysTrader.id = null
        initData.bizDate = parseTime(new Date(),'{y}-{m}-{d}')
        initData.bizPoInDetails = []
        initData.bizPoInDetails.push(detailData)
        mapPoInSerial.clear();
        this.poinForm = initData
      },
      getNewDetailData(){
        let data = Object.assign({}, bizPoInDetailsTemplate); //复制并新建一个对象
        let skuData = Object.assign({}, bizPoInDetailsTemplate.sysSku)
        //注意都要初始化，否则会记录上一次的值
        data.sysSku = skuData
        data.bizTradeSerialFlow = []
        data.keywords = uuid.v1()
        return data
      },
      delDetailData(keywords,objectArray){
        let index = objectArray.findIndex(item =>{
          if(item.keywords==keywords){
            return true
          }
        })
        objectArray.splice(index,1)
      },
      changeSysSkuItem(obj){
        obj.sysSku = this.getSkuItem(obj.sysSku.id);  //对象直接深层至sysSku
        this.getSkusInfo()
        let count = 0;
        for( let index = 0 ;index < this.poinForm.bizPoInDetails.length ; index++ ){
            let sysSkuId = this.poinForm.bizPoInDetails[index].sysSku.id;
            if (obj.sysSku.id === sysSkuId) count++
        }
        if (count > 1) {
          obj.sysSku = Object.assign({}, bizPoInDetailsTemplate.sysSku)
          //this.delDetailData(obj.keywords, this.poinForm.bizPoInDetails) //根据keywords删除对应记录
          this.$notify.error({
            title: '错误',
            message: '选择商品重复'
          });
        }
        //不知道为什么，每次更新时，this.skuDatas的值改变,迫不得已还原源值，要找出为什么
      },
      getBizNoteInfo(){
        get(this.poId).then(data => {
          this.poinForm = data
          this.loading = false
        })
      },
      //暂时不用
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
      getSkuItem(skuId){
        let sku = {};
        sku = this.skuDatas.find((item)=>{
          return item.id === skuId ;
        });
        return sku;
      },
      operatorSerialInfo(obj,index){
        if (obj.sysSku.id == null ) return
        obj.sysSku = this.getSkuItem(obj.sysSku.id)
        this.currentSelectTarget = obj
        if (mapPoInSerial.has(obj.keywords))
        {
          this.currentSelectTarget.bizTradeSerialFlow = mapPoInSerial.get(obj.keywords);
        }
        //控制串号窗体显示
        this.serialInfoVisible = true
      },
      selectRow (val) {
        this.selectDetailRows = val
      },
      // 删除选中行
      handleTableDel () {
        this.selectDetailRows.forEach((item) => {
          for (let i = 0; i < this.poinForm.bizPoInDetails.length; i++) {
            if (this.poinForm.bizPoInDetails[i].keywords == item.keywords) {
              this.poinForm.bizPoInDetails.splice(i, 1);
              break;
            }
          }
        });
        this.$refs.poinDetailRef.clearSelection()
      },
      youlan(){
          //需要测试时，使用此方法，一直沿用下去

      },
      handleTableAdd(){
        /*
        let data = Object.assign({}, bizPoInDetailsTemplate); //复制并新建一个对象
        let skuData = Object.assign({}, bizPoInDetailsTemplate.sysSku)
        //注意都要初始化，否则会记录上一次的值
        data.sysSku = skuData
        data.bizTradeSerialFlow = []
        data.keywords = uuid.v1()
        this.poinForm.bizPoInDetails.push(data)
        */
        this.poinForm.bizPoInDetails.push(this.getNewDetailData())
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
        //wxl modi
        //因为v-bind:currentSelectTarget,currentSelectTarget.row,currentSelectTarget
        this.currentSelectTarget.bizTradeSerialFlow = JSON.parse(JSON.stringify(serialData))
        mapPoInSerial.set(this.currentSelectTarget.keywords,this.currentSelectTarget.bizTradeSerialFlow)

      },
      /*
          插件控制method
       */
      dealDisabledDate(time) {
        // time 是一个new Date数据
        if (new Date(time).getTime() > new Date().getTime()) {

          return time.getTime() >= (new Date().getTime());//时间范围必须是时间戳
        } else {
          return time.getTime() < Date.now() - 30 * 8.64e7;//两天之内 根据自己需求来定
        }
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
