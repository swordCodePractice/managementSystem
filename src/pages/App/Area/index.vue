<template>
  <div class="areaIndex">
    <!-- 添加专区的按钮 -->
    <a-button type="primary" @click="areaModal = true;">添加专区</a-button>
    <!-- 表格 -->
    <a-table
      style="margin-top: 10px"
      :row-key="(record) => record._id"
      @change="handleTableChange"
      :pagination="{
        current: tableConfig.page,
        pageSize: tableConfig.limit,
        total: tableConfig.total,
      }"
      :loading="tableConfig.loading"
      :dataSource="dataSource"
    >
      <a-table-column title="名称" data-index="name" />
      <a-table-column title="图标" data-index="iconPath">
        <template #default="{ text: icon }">
          <a-image :width="50" :src="icon" />
        </template>
      </a-table-column>
      <a-table-column title="创建时间" data-index="createDate">
        <template #default="{ text: time }">
          {{ dayJs(time).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template #default="{ record }">
          <span>
            <a-button type="primary" @click="handleUpdateArea(record)"
              >修改</a-button
            >
          </span>
        </template>
      </a-table-column>
    </a-table>
    <a-modal v-model:visible="areaModal" title="编辑专区">
      <a-form
        :model="areaInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="专区名称">
          <a-input placeholder="请填写专区名称" v-model:value="areaInfo.name" />
        </a-form-item>
        <a-form-item label="专区图片">
          <a-upload
            :data="uploadConfig.content"
            v-model:file-list="fileList"
            name="avatar"
            :header="uploadConfig.headers"
            list-type="picture-card"
            :show-upload-list="false"
            action="https://c7e81452-9d28-4486-bedc-5dbf7c8386a5.bspapp.com/http/v1/application"
            :before-upload="handleBeforeUpload"
          >
            <img v-if="areaInfo.iconPath !== ''" :src="areaInfo.iconPath" alt="pic" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
import dayJs from "dayjs";
// api
import { getAreaList } from "../../../api/area";
import { SERVERLESS_ACTION_TEST } from "../../../config/url"
interface ITableConfig {
  page: number;
  limit: number;
  total: number;
  loading: boolean;
}
interface IAreaInfo {
  name: string;
  iconPath: string;
}
export default defineComponent({
  setup() {
    const uploadConfig = ref({
      headers: null,
      content: null
    })
    // 上传时需要的Data配置
    const uploadData = ref({
      service: "common",
      action: "uploadFile",
      method: "post"
    });
    // 修改和新增的弹框
    const areaModal = ref(false);
    const areaInfo = ref<IAreaInfo>({
      name: "",
      iconPath: ""
    });
    // 表格配置
    const tableConfig = ref<ITableConfig>({
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
    });
    // 表格列表
    const dataSource = ref([]);
    const getData = async () => {
      tableConfig.value.loading = true;
      const result = await getAreaList({
        limit: tableConfig.value.limit,
        page: tableConfig.value.page,
      });
      tableConfig.value.loading = false;
      if (result.success) {
        dataSource.value = result.data.list;
        tableConfig.value.total = result.data.count;
      }
    };
    getData();
    // 分页
    const handleTableChange = (e: { current: number }): void => {
      tableConfig.value.page = e.current;
      getData();
    };
    // 上传之前的回调
    const handleBeforeUpload = (file: File) => {
      // 构造formData
      const form = new FormData()
      form.append("service", "common");
      form.append("action", "uploadFile");
      form.append("method", "post");
      form.append("file", file);      
    }
    // 修改
    const handleUpdateArea = () => {};
    // 新增
    const handleAddArea = () => {
      
    };
    return {
      SERVERLESS_ACTION_TEST,
      areaInfo,
      areaModal,
      dayJs,
      dataSource,
      tableConfig,
      uploadData,
      uploadConfig,
      handleTableChange,
      handleBeforeUpload
    };
  },
});
</script>
<style scoped>
</style>