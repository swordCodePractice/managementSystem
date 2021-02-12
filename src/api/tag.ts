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