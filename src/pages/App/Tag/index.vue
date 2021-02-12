<template>
  <div class="tagIndex">
    <a-button type="primary" @click="tagModal = true">添加标签</a-button>
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
      <a-table-column title="专区" data-index="areaInfo">
        <template #default="{ text: areaInfo }">
          {{ areaInfo.map((a) => a.name)[0] }}
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
            <a-button type="primary" @click="handleBeforeUpdateArea(record)"
              >修改</a-button
            >
            <a-popconfirm
              title="您确定要删除此标签么？删除之后的标签不会再有新题目可以选择它了"
              ok-text="是的"
              cancel-text="算了"
              @confirm="handleDeleteTag(record)"
            >
              <a-button style="margin-left: 10px" type="danger">删除</a-button>
            </a-popconfirm>
          </span>
        </template>
      </a-table-column>
    </a-table>
    <a-modal v-model:visible="tagModal" title="编辑标签">
      <a-form :model="tagInfo">
        <a-form-item label="选择专区">
          <a-select
            :defaultValue="tagInfo.areaID"
            v-model:value="tagInfo.areaID"
            style="width: 120px"
          >
            <!-- 渲染专区 -->
            <a-select-option
              v-for="area in tagInfo.areaList"
              :key="area._id"
              :value="area._id"
            >
              {{ area.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签名称">
          <a-input placeholder="请填写标签名称" v-model:value="tagInfo.name" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="tagModal = false">返回</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="tagInfo.loading"
          @click="handleSaveTag"
          >提交</a-button
        >
      </template>
    </a-modal>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref } from "vue";
import { message } from "ant-design-vue";
// api
import { getTagList, saveTag, deleteTag } from "../../../api/tag";
import { getAreaList } from "../../../api/area";
import dayJs from "dayjs";
interface ITableConfig {
  page: number;
  limit: number;
  total: number;
  loading: boolean;
}
interface ITagInfo {
  _id: string,
  loading: boolean;
  name: string;
  areaID: string;
  areaList: object[];
}
export default defineComponent({
  setup() {
    const tagModal = ref<boolean>(false);
    const tagInfo = ref<ITagInfo>({
      _id: "",
      loading: false,
      name: "",
      areaID: "",
      areaList: [],
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
    const getAreaData = async () => {
      const areaResult = await getAreaList({
        limit: 99,
        page: 1,
      });
      if (areaResult.success) {
        // 设置一个默认值
        if (areaResult.data.list.length !== 0) {
          tagInfo.value.areaID = areaResult.data.list[0]._id;
        }
        tagInfo.value.areaList = areaResult.data.list;
      }
    };
    // 调用获取专区信息
    getAreaData();
    getData();
    const handleTableChange = (e: { current: number }): void => {
      tableConfig.value.page = e.current;
      getData();
    };
    // 保存标签
    const handleSaveTag = async () => {
      // 判断标签名合法性
      if (tagInfo.value.name.trim() === "") {
        message.warning("标签名不合法");
      } else {
        tagInfo.value.loading = true;
        const saveResult = await saveTag({
          _id: tagInfo.value._id,
          name: tagInfo.value.name,
          areaID: tagInfo.value.areaID,
        });
        tagInfo.value.loading = false;
        if (saveResult.success) {
          message.success("操作成功");
          // 重新请求列表
          getData();
          tagInfo.value.name = "";
          tagModal.value = false;
          // 清空此项是至关重要的，因为要拿ID判断是新增还是修改
          tagInfo.value._id = "";
        }
      }
    };
    // 修改标签前的准备
    const handleBeforeUpdateArea = (record: {
      _id: string;
      name: string;
      areaID: string;
    }) => {
      tagInfo.value._id = record._id;
      tagInfo.value.name = record.name;
      tagInfo.value.areaID = record.areaID;
      tagModal.value = true;
    };
    // 删除标签
    const handleDeleteTag = async (record: { _id: string }) => {
      const deleteResult = await deleteTag({
        _id: record._id,
      });
      if (deleteResult.success) {
        message.success("操作成功");
        getData();
      }
    };
    return {
      tagInfo,
      tagModal,
      dayJs,
      dataSource,
      tableConfig,
      handleTableChange,
      handleSaveTag,
      handleDeleteTag,
      handleBeforeUpdateArea
    };
  },
});
</script>
<style scoped>
</style>