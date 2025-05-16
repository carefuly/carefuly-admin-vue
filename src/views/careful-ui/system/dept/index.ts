const page = {
  pageData: {
    showSearch: true,
    pageParams: {
      creator: null,
      modifier: null,
      page: 1,
      pageSize: 10,
      status: true,
      name: "",
      code: "",
    },
    ids: [],
    single: true,
    multiple: true,
    title: "",
    confirmLoading: false,
    form: {
      id: null,
      parent_id: null,
      name: "",
      code: "",
      owner: "",
      phone: "",
      email: "",
      sort: 1,
      status: true,
      remark: null,
    },
    rules: {
      name: [{required: true, message: "请输入部门名称", trigger: "blur"}],
      code: [{required: true, message: "请输入部门编码", trigger: "blur"}],
    },


    loading: false,
    total: 0,

    tableList: [],
  },
};

export default page;
