<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="sysSkuClassify"
            clearable
            size="small"
            placeholder="输入商品分类名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getSysSkuClassifyDatas"
          />
        </div>
        <el-tree
          :data="sysSkuClassifyDatas"
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
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入编号助记码商品全称搜索"
              style="width: 220px;"
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
                <el-form-item label="编号" prop="code"  label-width="80px">
                  <el-input  v-model.trim="form.code"    style="width: 160px" >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="助记码" prop="mnemonicCode"  label-width="80px">
                  <el-input  v-model.trim="form.mnemonicCode"     style="width: 160px" >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="品牌" prop="brand"  label-width="80px">
                  <el-autocomplete
                    class="inline-input"
                    v-model="form.brand"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    style="width: 160px"
                  >
                    <i slot="suffix" class="el-input__icon  el-icon-search"></i>

                  </el-autocomplete>

                </el-form-item>
              </el-col>
              <el-col :span="12">

                  <el-form-item label="颜色" prop="color"  label-width="80px">
                    <el-autocomplete
                      class="inline-input"
                      v-model="form.color"
                      :fetch-suggestions="querySearchColor"
                      placeholder="请输入内容"
                      style="width: 160px"
                    >
                      <i slot="suffix" class="el-input__icon  el-icon-search"></i>
                    </el-autocomplete>

                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="12">
                <el-form-item label="型号" prop="name"  label-width="80px">
                  <el-input  v-model="form.name"    style="width: 160px" >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">

                <el-form-item  label="分类"  label-width="80px" prop="sysSkuClassify.id"   :rules="rules.sysSkuClassify" >
                  <treeselect  v-model="form.sysSkuClassify.id"  :options="sysSkuClassifyDatas" style="width: 170px" placeholder="选择商品分类"/>
                </el-form-item>

              </el-col>
            </el-row>

            <el-row>
              <el-col  :span="24">
                <el-form-item label="商品全称" prop="fullName"  label-width="80px">
                  <el-input  v-model="form.fullName"    style="width: 425px" >
                    <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col  :span="12">
                <el-form-item label="库龄" prop="stockAge"  label-width="80px"  >
                  <el-input-number v-model="form.stockAge" :min="0" :max="1000" label="库龄"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成本计算" prop="costFlag"  label-width="80px">
                  <el-switch
                    style="display: block;margin:5px 0 0px 0px;"
                    v-model="form.costFlag"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="单体"
                    inactive-text="均价">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
           <el-row>
               <el-form-item label="备注"   prop="remark"  >
               <el-input   type = "textarea" v-model.trim="form.remark"
                           :autosize="{ minRows: 2, maxRows: 3}"
                           style="width: 440px;"
               >
                 <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
               </el-input>
             </el-form-item>
           </el-row>
            <el-row>
              <el-col  :span="8">
                <el-form-item label="虚拟商品" prop="virFlag"  label-width="80px">
                  <el-checkbox v-model="form.virFlag" style="margin:0px 0 0px 0px;">是
                  </el-checkbox>
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


         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button type="text" @click="crud.cancelCU">取消</el-button>
           <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
         </div>
       </el-dialog>
       <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column v-if="columns.visible('code')" prop="code" label="商品编号"  width="90"/>
          <el-table-column v-if="columns.visible('mnemonic_code')" prop="mnemonic_code" label="助记码"  width="90"/>
          <el-table-column v-if="columns.visible('brand')" prop="brand" label="品牌"  width="80"/>
          <el-table-column v-if="columns.visible('name')" prop="name" label="商品型号"  width="150"/>
          <el-table-column v-if="columns.visible('color')" prop="color" label="颜色"  width="80"/>
          <el-table-column v-if="columns.visible('fullName')" prop="fullName" label="商品全称"  width="150"/>
          <el-table-column v-if="columns.visible('sysSkuClassify')" :show-overflow-tooltip="true" width="120" prop="sysSkuClassify" label="商品分类">
            <template slot-scope="scope">
              <div>{{ scope.row.sysSkuClassify.fullName.substring(0,scope.row.sysSkuClassify.fullName.length-1) }} </div>
            </template>
          </el-table-column>
          <el-table-column v-if="columns.visible('stockAge')" prop="stockAge" label="库龄"  width="60" align="right"/>
          <el-table-column v-if="columns.visible('costFlag')" prop="costFlag" label="成本类别"  width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.costFlag === true">
                <el-tag  effect="dark" type = "success">单体</el-tag>
              </div>
              <div v-else>
                <el-tag  effect="dark" type = "info">均价</el-tag>
              </div>

            </template>
          </el-table-column>
          <el-table-column v-if="columns.visible('serialInfo')" prop="serialInfo" label="串号信息"  width="80"/>
          <el-table-column v-if="columns.visible('virFlag')" prop="virFlag" label="虚拟商品"  align="center" width="70"   >
              <template slot-scope="scope">
                <div v-if="scope.row.virFlag === true">
                  <el-tag  effect="dark" type = "danger">是</el-tag>
                </div>
                <div v-else>
                  <el-tag  effect="dark" type = "info">否</el-tag>
                </div>

              </template>
          </el-table-column>

          <el-table-column v-if="columns.visible('enabled')" label="状态" align="center" prop="enabled">
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
  import curdSku from '@/api/system/sku'
  import { getSkuClassifys } from '@/api/system/skuclassify'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import Treeselect from '@riophae/vue-treeselect'
  import { mapGetters } from 'vuex'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'


  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '商品信息', url: 'api/sysSku', crudMethod: { ...curdSku }})
  const defaultForm = {
    id: null,
    code:'',
    mnemonicCode:'',
    name: '',
    brand:'',
    color:'',
    fullName:'',
    sysSkuClassify: { id: null },
    stockAge:0,
    costFlag:0,
    serialInfo:'',
    virFlag:0,
    enabled: 'true',
    sort:999,
    remark:"",
    isDelete:0,
    version:0,
    keywords:null,
    topCompanyCode:null
  }

  export default {
    name: 'Sku',
    components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    // 数据字典
    dicts: ['job_status'],
    data() {

      return {
        height: document.documentElement.clientHeight - 180 + 'px;',
        sysSkuClassify: '', skus: [], sysSkuClassifyDatas: [],brands:[],colors:[],
        defaultProps: { children: 'children', label: 'name' },
        permission: {
          add: ['admin', 'sku:add'],
          edit: ['admin', 'sku:edit'],
          del: ['admin', 'sku:del']
        },
        enabledTypeOptions: [
          { key: 'true', display_name: '开启' },
          { key: 'false', display_name: '禁止' }
        ],
        rules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          sysSkuClassify: { required: true, message: '商品分类不能为空', trigger: 'blur' }

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
        this.getSysSkuClassifyDatas()
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
      querySearch(queryString, cb) {
        var brands = this.brands;
        var results = queryString ? brands.filter(this.createFilter(queryString)) : brands;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (brands) => {
          return (brands.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearchColor(queryString, cb) {
        var colors = this.colors;
        var results = queryString ? colors.filter(this.createFilterColor(queryString)) : colors;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterColor(queryString) {
        return (colors) => {
          return (colors.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      [CRUD.HOOK.afterAddError](crud) {
        this.afterErrorMethod(crud)
      },
      [CRUD.HOOK.afterEditError](crud) {
        this.afterErrorMethod(crud)
      },
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        this.getSkuClassifys()
        this.getBrands()
        this.getColors()
        form.enabled = form.enabled.toString()  //一定要这里toString,否则点新增或修改时，无法选中

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
        /*
        if (!crud.form.sysSkuClassify.id) {
          this.$message({
            message: '商品分类不能为空',
            type: 'warning'
          })
          return false
        }
         */
        return true
      },
      // 获取左侧部门数据
      getSysSkuClassifyDatas() {
        const sort = 'id,desc'
        const params = { sort: sort }
        if (this.sysSkuClassify) { params['name'] = this.sysSkuClassify }
        getSkuClassifys(params).then(res => {
          this.sysSkuClassifyDatas = res.content
        })
      },
      // 获取弹窗内部门数据
      getSkuClassifys() {
        getSkuClassifys({ enabled: true }).then(res => {
          this.skus = res.content

        })
      },
      getBrands() {
        curdSku.getBrands().then(res => {
          this.brands = res.content;
        }).catch(() => {

        })
      },
      getColors() {
        curdSku.getColors().then(res => {
          this.colors = res.content;

        }).catch(() => {

        })
      },
      // 切换分类
      handleNodeClick(data) {
        if (data.pid === 0) {
         this.query.classifyId = null
        } else {
         this.query.classifyId = data.id
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
          curdSku.edit(data).then(res => {
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
