<template>
  <div class="tagIndex">
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
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
// api
import { getTagList } from "../../../api/tag";
import dayJs from "dayjs";
interface ITableConfig {
  page: number;
  limit: number;
  total: number;
  loading: boolean;
}
export default defineComponent({
  setup() {
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
      const result = await getTagList({
        page: tableConfig.value.page,
        limit: tableConfig.value.limit,
      });
      tableConfig.value.loading = false;
      if (result.success) {
        dataSource.value = result.data.list;
        tableConfig.value.total = result.data.count;
      }
    };
    getData();
    const handleTableChange = () => {

    }
    return {
      dayJs,
      dataSource,
      tableConfig,
      handleTableChange
    };
  },
});
</script>
<style scoped>
</style>