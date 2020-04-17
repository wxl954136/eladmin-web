<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable size="small" placeholder="输入商品分类搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-row>
            <el-col :span="24">
                <el-form-item label="名称"   prop="name">
                  <el-input v-model="form.name"  ref="input" >
                      <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="salerFlag">
                <el-checkbox v-model="form.salerFlag">供应商</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户" prop="buyerFlag">
                <el-checkbox v-model="form.buyerFlag">客户</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="帐期" prop="period">
                <el-input v-model="form.period"  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"  maxlength="4">
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="信用额度" prop="creditAmout" >
                <el-input v-model="form.creditAmout" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"  maxlength="7" >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contacter">
                <el-input v-model="form.contacter" >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="tel">
                <el-input v-model="form.tel"  >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address"   >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="银行名称" prop="bankName">
                <el-input v-model="form.bankName" >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行帐户" prop="bankAccout">
                <el-input v-model="form.bankAccout"  >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark"   >
                  <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="状态">
            <el-radio-group v-model="form.enabled" >
              <el-radio  v-for="item in dict.job_status"  :key="item.id"  :label="item.value" >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="名称" width = "150" />
        <el-table-column v-if="columns.visible('salerFlag')" prop="salerFlag" label="供应商客户"  width = "90">
          <template slot-scope="scope">
            <div v-if="scope.row.salerFlag === true" style = "display:inline;">
              <el-tag  effect="dark" type = "danger">是</el-tag>
            </div>
            <div v-else style = "display:inline;">
              <el-tag  effect="dark" type = "info">否</el-tag>
            </div>
            <div v-if="scope.row.buyerFlag === true" style = "display:inline;">
              <el-tag  effect="dark" type = "danger">是</el-tag>
            </div>
            <div v-else style = "display:inline;">
              <el-tag  effect="dark" type = "info">否</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('period')" prop="period" label="帐期" width = "60" >
          <template slot-scope="scope">
            <div>{{ scope.row.period }}天</div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('creditAmout')" prop="creditAmout" label="信用额度" width = "80" >
          <template slot-scope="scope">
            <div>{{ scope.row.creditAmout }}元</div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('contacter')" prop="contacter" label="联系方式" >

          <template slot-scope="scope">
            <div>{{ scope.row.contacter }} / {{ scope.row.tel }} / {{ scope.row.address }} </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('bankName')" prop="contacter" label="银行信息" >
          <template slot-scope="scope">
            <div>{{ scope.row.bankName }} / {{ scope.row.bankAccout }}</div>
          </template>
        </el-table-column>
 

        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />

        <el-table-column v-if="columns.visible('enabled')" label="状态" align="center" prop="enabled"  width = "60">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期"  width = "150">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>


        <el-table-column v-permission="['admin','trader:edit','trader:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysTrader from '@/api/system/sysTrader'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '往来单位', url: 'api/sysTrader', sort: 'id,desc', crudMethod: { ...crudSysTrader }})
const defaultForm = { id: null, name: null, salerFlag: 1, buyerFlag: 1, period: 0, creditAmout: 0, contacter: '', tel: '', address: '', bankName: '', bankAccout: '', remark: '', isDelete: 0, version: 0, enabled: 'true'}
export default {
  name: 'SysTrader',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'trader:add'],
        edit: ['admin', 'trader:edit'],
        del: ['admin', 'trader:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        salerFlag: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        buyerFlag: [
          { required: true, message: '客户商不能为空', trigger: 'blur' }
        ],
        period: [
          { required: true, message: '帐期不能为空', trigger: 'blur' }
        ],
        creditAmout: [
          { required: true, message: '信用额度不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '启用状态不能为空', trigger: 'blur' }
        ]
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ]

    }
  },
  methods: {
    // 获取数据前设置好接口地址
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {


      form.enabled = form.enabled.toString()  //一定要这里toString,否则点新增或修改时，无法选中

      //lukeWang：当点击添加按钮时，光标注处于文本尾处 ,一定要放到afterToCU,否则defautForm值还未赋值，仅是DOM元素加载
      this.$nextTick(function () {
        this.$refs.input.focus();
        length = this.$refs.input.length;
        this.$refs.input.selectionStart = length;
        this.$refs.input.selectionEnd = length;

      })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      //提交前给予验证
      //this.form.version++;
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '往来单位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudSysTrader.edit(data).then(res => {
          this.crud.notify(this.dict.label.job_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
