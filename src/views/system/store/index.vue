<!--
@author luke：王晓陆
ID:   author    DATE          MARK
001   LUKE      2020-04-02    基础信息以此类为解本
002   LUKE      2020-04-06    在【input:仓库名称】自定义指定focus,特别注意:inserted:首次进来时会获得焦点，
                              update:二次或改时获得焦占o
003   LUKE      2020-04-07    在list列表中，当单独Radio切换时由于和edit公用PostMapping后台,
                              为了保证行记录的version版本号(手动乐观锁),须在前端+1
-->
<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="50" />
      <el-table-column v-if="columns.visible('name')" prop="name" label="仓库名称"  width="150"/>
      <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序"  width="50"/>
      <el-table-column v-if="columns.visible('status')" prop="status" label="状态" align="center" width="80" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>

      <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注"  width="200"/>

      <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin','store:edit','store:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
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
    <!--表单渲染-->
    <eForm :job-status="dict.job_status" />
  </div>
</template>

<script>
import curdStore from '@/api/system/store'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

// crud交由presenter持有
const crud = CRUD({
  title: '仓库',
  url: 'api/sysStore',
  sort: ['sort,asc', 'id,desc'],
  crudMethod: { ...curdStore }
})

export default {
  name: 'Store',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  mixins: [presenter(crud)],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'store:add'],
        edit: ['admin', 'store:edit'],
        del: ['admin', 'store:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '仓库, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crud.crudMethod.edit(data).then(() => {
          //lukeWang:更新完之后，version版本一定要累加一次，否则无法连续二次提次
          data.version = data.version + 1
          crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
