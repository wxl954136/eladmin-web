<template>
  <div class="app-container">
    <!--工具栏-->
      <div class="head-container">

        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.bizNo" clearable size="small" placeholder="请输入单据号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
        <crudOperation :permission="permission" />
      </div>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <!--
          <el-form-item label="往来单位id">
            <el-input v-model="form.traderId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库id">
            <el-input v-model="form.storeId" style="width: 370px;" />
          </el-form-item>
          -->
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" style="width: 370px;" />
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="请求方法">
                <span>22222</span>
              </el-form-item>
              <el-form-item label="请求参数">
                <span>111111</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('bizNo')" prop="bizNo" label="单据编号" />
        <el-table-column v-if="columns.visible('bizDate')" prop="bizDate" label="单据日期"   >
          <template slot-scope="scope">
            <span>{{scope.row.bizDate }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('sysTrader')" :show-overflow-tooltip="true" width="110" prop="sysTrader" label="往来单位">
          <template slot-scope="scope">
            <div>{{ scope.row.sysTrader.name }} </div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('sysStore')" :show-overflow-tooltip="true" width="110" prop="sysStore" label="仓库">
          <template slot-scope="scope">
            <div>{{ scope.row.sysStore.name }} </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('handler')" prop="handler" label="经手人" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','bizPoIn:edit','bizPoIn:del']" label="操作" width="150px" align="center">
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
</template>

<script>
import crudBizPoIn from '@/api/biz/bizPoIn'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'


// crud交由presenter持有
const defaultCrud = CRUD({ title: '采购入库', url: 'api/bizPoIn', sort: 'id,desc', crudMethod: { ...crudBizPoIn }})
const defaultForm = { id: null, noteNo:"",
  sysTrader: {
    id: null
  },
  sysStore: {
    id: null
  }, handler:"",remark: null, isDelete: 0, version: 0, topCompanyCode: null }
export default {
  name: 'BizPoIn',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'bizPoIn:add'],
        edit: ['admin', 'bizPoIn:edit'],
        del: ['admin', 'bizPoIn:del']
      },
      rules: {
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
