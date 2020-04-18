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
          <el-form-item label="sku主键">
            <el-input v-model="form.skuId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.qty" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="采购价">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="税率">
            <el-input v-model="form.rate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
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
        <el-table-column v-if="columns.visible('skuId')" prop="skuId" label="sku主键" />
        <el-table-column v-if="columns.visible('qty')" prop="qty" label="数量" />
        <el-table-column v-if="columns.visible('price')" prop="price" label="采购价" />
        <el-table-column v-if="columns.visible('rate')" prop="rate" label="税率" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','bizPoInDetail:edit','bizPoInDetail:del']" label="操作" width="150px" align="center">
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
import crudBizPoInDetail from '@/api/bizPoInDetail'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '/api/bizPoInDetail', url: 'api/bizPoInDetail', sort: 'id,desc', crudMethod: { ...crudBizPoInDetail }})
const defaultForm = { id: null, headId: null, skuId: null, qty: null, price: null, rate: null, remark: null, isDelete: null, version: null, updateTime: null, createTime: null, topCompanyCode: null, notes: null }
export default {
  name: 'BizPoInDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'bizPoInDetail:add'],
        edit: ['admin', 'bizPoInDetail:edit'],
        del: ['admin', 'bizPoInDetail:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'skuId', display_name: 'sku主键' }
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
