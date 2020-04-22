<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="78px">
      <el-col>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">订单信息</span>
            <el-button-group style = "float: right">
              <el-button type="primary" size="mini" icon="el-icon-arrow-left">上一页</el-button>
              <el-button type="primary" size="mini">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              <el-button   icon="el-icon-check"  size="mini" type="primary" >保存</el-button>
            </el-button-group>

          </div>




            <el-row :gutter="3">
              <el-col :span="6">
                <el-form-item label="单据编号" prop="bizNo" >
                  <el-input v-model="form.bizNo" style="width: 180px;" />
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
                <!--
                <el-form-item label="往来单位" prop="sysTrader.id">
                  <el-input v-model="form.sysTrader.id" style="width: 180px" />
                </el-form-item>
                -->
              </el-col>
              <el-col :span="6">
                <!--
                <el-form-item label="入库仓位" prop="sysStore.id">
                  <el-input v-model="form.sysStore.id" style="width: 180px" />
                </el-form-item>
                -->
              </el-col>
              <el-col :span="6">
                <el-form-item label="付款方式" prop="payMethod">
                  <el-input v-model="form.payMethod" style="width: 180px" />
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
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">商品信息：</span>
            <el-button-group style = "float:right">
              <el-button type="primary" size="mini" icon="el-icon-plus">增加行</el-button>
              <el-button type="primary" size="mini">删除行<i class="el-icon-arrow-right el-icon-minus "></i></el-button>
            </el-button-group>
          </div>
          <el-table  v-loading="loading"
                     element-loading-text="正在努力加载，请稍候"
                     element-loading-spinner="el-icon-loading"
                     :data="data"  :max-height="tableHeight" size="small" style="width: 100%;margin-bottom: 15px">
            <el-table-column prop="qty" label="数量">
            </el-table-column>
            <el-table-column prop="price" label="单价">
              <template slot-scope="scope">
              <el-input v-model="data[scope.$index].price" size="mini" class="edit-input" />
              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import crud from '@/mixins/crud'
  import {  get } from '@/api/biz/bizPoInConfig'

  export default {
    name: 'BizPoInConfig',
    components: {},
    mixins: [crud],
    data() {
      return {
        poId: '', tableHeight: 550, columnLoading: false,  dicts: [], syncLoading: false, genLoading: false,
        form: { id: null, bizNo:'',payMethod:null,bizDate:new Date().toString(),bizPoInDetails:{id:null},sysStore:{id:null},sysTrader:{id:null},handler:"",remark:null,isDelete:0,version:0,topCompanyCode:null},
        rules: {
         
        }
      }
    },
    created() {
      this.tableHeight = document.documentElement.clientHeight - 385
      this.poId = this.$route.params.poId
      get(this.poId).then(data => {
        this.form = data
        this.data = data.bizPoInDetails  //this.data,来自于crud.js中的定义
      })

    },
    mounted(){


    },
    methods: {




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
