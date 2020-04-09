<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            size="small"
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getDeptDatas"
          />
        </div>
        <el-tree
          :data="deptDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.name"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
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
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <rrOperation :crud="crud" />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input  v-model.trim="form.name"  ref="input"  style="width: 178px" >
                          <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item  label="部门"  prop="dept.id"   :rules="rules.dept" >
                      <treeselect  v-model="form.dept.id"  :options="depts" style="width: 178px" placeholder="选择部门"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item  label="排序"  prop="sort" >
                        <el-input-number v-model.number="form.sort"  :min="0"  :max="999"  controls-position="right"  style="width: 178px"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                   <el-form-item label="状态">
                       <el-radio-group v-model="form.enabled" >
                           <el-radio  v-for="item in dict.job_status"  :key="item.id"  :label="item.value" >{{ item.label }}</el-radio>
                       </el-radio-group>
                   </el-form-item>
               </el-col>
           </el-row>
           <el-row>
               <el-form-item label="备注"   prop="remark"  >
               <el-input   type = "textarea" v-model.trim="form.remark"
                           :autosize="{ minRows: 2, maxRows: 4}"
                           style="width: 440px;"
               >
                 <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
               </el-input>
             </el-form-item>
           </el-row>

         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button type="text" @click="crud.cancelCU">取消</el-button>
           <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
         </div>
       </el-dialog>
       <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column v-if="columns.visible('name')" prop="name" label="仓库名称"  width="150"/>
          <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序"  width="50"/>
          <el-table-column v-if="columns.visible('dept')" :show-overflow-tooltip="true" width="110" prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} </div>
            </template>
          </el-table-column>
          <el-table-column v-if="columns.visible('enabled')" label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="user.id === scope.row.id"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注"  width="200"/>
          <el-table-column v-if="columns.visible('createTime')" :show-overflow-tooltip="true" prop="createTime" width="140" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-permission="['admin','store:edit','store:del']"
            label="操作"
            width="125"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import crudStore from '@/api/system/store'
  import { getDepts } from '@/api/system/dept'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import Treeselect from '@riophae/vue-treeselect'
  import { mapGetters } from 'vuex'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'


  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '仓库', url: 'api/sysStore', crudMethod: { ...crudStore }})
  const defaultForm = {
    id: null,
    name: '',
    sort: 999,
    enabled: 'true',
    dept: {
      id: null
    },
    isDelete:0,
    remark:"",
    version:0,
    keywords:null,
    topCompanyCode:null
  }

  export default {
    name: 'Store',
    components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    // 数据字典
    dicts: ['job_status'],
    data() {

      return {
        height: document.documentElement.clientHeight - 180 + 'px;',
        deptName: '', depts: [], deptDatas: [],
        defaultProps: { children: 'children', label: 'name' },
        permission: {
          add: ['admin', 'store:add'],
          edit: ['admin', 'store:edit'],
          del: ['admin', 'store:del']
        },
        enabledTypeOptions: [
          { key: 'true', display_name: '开启' },
          { key: 'false', display_name: '禁止' }
        ],
        rules: {
          name: [
            { required: true, message: '请输入仓库名称', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
          ] ,
          dept: { required: true, message: '所属部门不能为空', trigger: 'select' }
        }
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.$nextTick(() => {
        this.getDeptDatas()
        this.crud.toQuery()
      })
    },
    mounted: function() {
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    methods: {
      [CRUD.HOOK.afterAddError](crud) {
        this.afterErrorMethod(crud)
      },
      [CRUD.HOOK.afterEditError](crud) {
        this.afterErrorMethod(crud)
      },
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        this.getDepts()
        form.enabled = form.enabled.toString()  //一定要这里toString,否则点新增或修发言时，无法选中

        //lukeWang：当点击添加按钮时，光标注处于文本尾处 ,一定要放到afterToCU,否则defautForm值还未赋值，仅是DOM元素加载
        this.$nextTick(function () {
          this.$refs.input.focus();
          //this.$refs.input.select();  //文本全选中状态
          length = this.$refs.input.length;
          this.$refs.input.selectionStart = length;
          this.$refs.input.selectionEnd = length;

        })
      },
      // 打开编辑弹窗前做的操作
      [CRUD.HOOK.beforeToEdit](crud, form) {

      },
      // 提交前做的操作
      [CRUD.HOOK.afterValidateCU](crud) {
        if (!crud.form.dept.id) {
          this.$message({
            message: '部门不能为空',
            type: 'warning'
          })
          return false
        }
        return true
      },
      // 获取左侧部门数据
      getDeptDatas() {
        const sort = 'id,desc'
        const params = { sort: sort }
        if (this.deptName) { params['name'] = this.deptName }
        getDepts(params).then(res => {
          this.deptDatas = res.content
        })
      },
      // 获取弹窗内部门数据
      getDepts() {
        getDepts({ enabled: true }).then(res => {
          this.depts = res.content
        })
      },
      // 切换部门
      handleNodeClick(data) {
        if (data.pid === 0) {
          this.query.deptId = null
        } else {
          this.query.deptId = data.id
        }
        this.crud.toQuery()
      },
      // 改变状态
      changeEnabled(data, val) {
        this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + ', 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudStore.edit(data).then(res => {
            this.crud.notify(this.dict.label.job_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          }).catch(() => {
            data.enabled = !data.enabled
          })
        }).catch(() => {
          data.enabled = !data.enabled
        })
      },

      checkboxT(row, rowIndex) {
        return row.id !== this.user.id
      }
    }
  }
</script>

<style scoped>
</style>
