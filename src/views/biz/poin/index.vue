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
      <!--
      <el-button
        v-if="crud.optShow.add"
        v-permission="permission.add"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addRecords"
      >
        新增
      </el-button>
      <el-button
        v-if="crud.optShow.edit"
        v-permission="permission.edit"
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1"
        @click="editRecords(crud.selections[0])"
      >
        修改
      </el-button>

-->

      <crudOperationRoute :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="主键">
          <el-input v-model="form.id" style="width: 370px;" />
        </el-form-item>
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
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small"
              style="width: 100%;" @selection-change="crud.selectionChangeHandler"  :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column type="selection" width="55" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.bizPoInDetails"   border
                    style = "margin-top: -21px;margin-left:50px; margin-bottom: -15px;" :header-cell-style="{background:'#eef1f0',color:'#606266'}">
            <el-table-column label = "商品名称" prop="sysSku" fixed width="200"  >
              <template slot-scope="scope">
                <div>{{ scope.row.sysSku.fullName }} </div>
              </template>
            </el-table-column>
            <el-table-column label = "数量" prop="qty" width="90" align="right"></el-table-column>
            <el-table-column label = "单价" prop="price" width="90"  align="right" >
              <template slot-scope="scope">
                <div><i class="el-icon-money"></i>{{ scope.row.price.toFixed(AMOUNTDIGIT)}} </div>
              </template>
            </el-table-column>
            <el-table-column label = "总额"  width="90" align="right">
              <template slot-scope="scope">
                <div><i class="el-icon-money"></i>{{ (scope.row.qty *  scope.row.price).toFixed(AMOUNTDIGIT)}} </div>
              </template>
            </el-table-column>
            <el-table-column label = "税率(%)" prop="rate" width="90" align="right"></el-table-column>
            <el-table-column label = "总额(含税)"  width="90" align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.rate === 0">
                  <div><i class="el-icon-money"></i> {{ parseFloat(scope.row.qty  * scope.row.price).toFixed(AMOUNTDIGIT)}} </div>
                </div>
                <div v-else>
                  <div><i class="el-icon-money"></i>{{ parseFloat(scope.row.qty * scope.row.rate * scope.row.price).toFixed(AMOUNTDIGIT)}} </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="串码详情" width="90" align = "center">
              <template slot-scope="scope">
                <div v-if = scope.row.sysSku.costFlag>
                  <router-link :to="'/po/poin/config/' + 'add'">
                    <i class="el-icon-folder-add el-icon--right"></i>详情
                  </router-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('bizNo')" prop="bizNo" label="单据编号" width="130"  align="left"/>
      <el-table-column v-if="columns.visible('bizDate')" prop="bizDate" label="单据日期"  width="100" align="center" >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{parseTime(new Date(scope.row.bizDate),'{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="columns.visible('sysTrader')" :show-overflow-tooltip="true" width="180" prop="sysTrader" label="往来单位"    >
        <template slot-scope="scope">
          <div>{{ scope.row.sysTrader.name }} </div>
        </template>
      </el-table-column>

      <el-table-column v-if="columns.visible('sysStore')" :show-overflow-tooltip="true" width="180" prop="sysStore" label="仓库">
        <template slot-scope="scope">
          <div>{{ scope.row.sysStore.name }} </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('handler')" prop="handler" label="经手人"  width="100" />
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
  import crudOperationRoute from '@crud/CRUD.operation.route'
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
    components: { pagination, crudOperationRoute, rrOperation, udOperation },
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
    mounted(){
      this.crud.routerAddress = '/po/poin/config/add'  //新增的路由地址，crud.js中定义
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      editRecords(obj){
        //取值方式 alert(obj.id)
      }

    }
  }
</script>

<style scoped>

</style>
