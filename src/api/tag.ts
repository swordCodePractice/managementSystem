import request from "../common/request";

export function getTagList(data: {
  limit: number;
  page: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    request({
      service: "questionTag",
      action: "getTagList",
      method: "get",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}

export function saveTag(data: {
  _id?: string;
  areaID: string;
  name: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    // 通过是否传递了ID，判断是否是修改
    request({
      service: "questionTag",
      action: data._id !== "" ? "updateQuestionTag" : "addQuestionTag",
      method: "post",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}

export function deleteTag(data: { _id: string }): Promise<ActionResult> {
  return new Promise((resolve) => {
    request({
      service: "questionTag",
      action: "deleteQuestionTag",
      method: "delete",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}
