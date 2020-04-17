<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="供应商" prop="salerFlag">
                未设置字典，请手动设置 Radio
          </el-form-item>
          <el-form-item label="客户商" prop="buyerFlag">
                未设置字典，请手动设置 Radio
          </el-form-item>
          <el-form-item label="帐期" prop="period">
            <el-input v-model="form.period" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="信用额度" prop="creditAmout">
            <el-input v-model="form.creditAmout" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contacter" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.tel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="银行名称">
            <el-input v-model="form.bankName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="银行帐户">
            <el-input v-model="form.bankAccout" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="删除标记">
            <el-input v-model="form.isDelete" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="form.version" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改日期">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业代码">
            <el-input v-model="form.topCompanyCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="系统注释">
            <el-input v-model="form.notes" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="启用状态" prop="enabled">
            <el-radio v-for="item in dict.job_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="主键" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
        <el-table-column v-if="columns.visible('salerFlag')" prop="salerFlag" label="供应商" />
        <el-table-column v-if="columns.visible('buyerFlag')" prop="buyerFlag" label="客户商" />
        <el-table-column v-if="columns.visible('period')" prop="period" label="帐期" />
        <el-table-column v-if="columns.visible('creditAmout')" prop="creditAmout" label="信用额度" />
        <el-table-column v-if="columns.visible('contacter')" prop="contacter" label="联系人" />
        <el-table-column v-if="columns.visible('tel')" prop="tel" label="电话" />
        <el-table-column v-if="columns.visible('address')" prop="address" label="地址" />
        <el-table-column v-if="columns.visible('bankName')" prop="bankName" label="银行名称" />
        <el-table-column v-if="columns.visible('bankAccout')" prop="bankAccout" label="银行帐户" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('isDelete')" prop="isDelete" label="删除标记" />
        <el-table-column v-if="columns.visible('version')" prop="version" label="版本号" />
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="修改日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('topCompanyCode')" prop="topCompanyCode" label="企业代码" />
        <el-table-column v-if="columns.visible('notes')" prop="notes" label="系统注释" />
        <el-table-column v-if="columns.visible('enabled')" prop="enabled" label="启用状态">
          <template slot-scope="scope">
            {{ dict.label.job_status[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sysTrader:edit','sysTrader:del']" label="操作" width="150px" align="center">
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
const defaultCrud = CRUD({ title: 'trader', url: 'api/sysTrader', sort: 'id,desc', crudMethod: { ...crudSysTrader }})
const defaultForm = { id: null, name: null, salerFlag: null, buyerFlag: null, period: null, creditAmout: null, contacter: null, tel: null, address: null, bankName: null, bankAccout: null, remark: null, isDelete: null, version: null, updateTime: null, createTime: null, topCompanyCode: null, notes: null, enabled: null }
export default {
  name: 'SysTrader',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'sysTrader:add'],
        edit: ['admin', 'sysTrader:edit'],
        del: ['admin', 'sysTrader:del']
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
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'salerFlag', display_name: '供应商' },
        { key: 'buyerFlag', display_name: '客户商' },
        { key: 'enabled', display_name: '启用状态' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
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
