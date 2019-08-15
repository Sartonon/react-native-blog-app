import createDataContext from "./createDataConext";
import jsonServer from "../api/jsonServer";

const defaultState = [];

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      return action.payload;
    case "edit_blogpost":
      return state.map(blogPost => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    case "delete_blogpost":
      return state.filter(blogPost => blogPost.id !== action.payload);
    default:
      return state;
  }
};

const actions = {
  getBlogPosts: dispatch => {
    return async () => {
      const response = await jsonServer.get(`/blogposts`);
      dispatch({ type: "get_blogposts", payload: response.data });
    };
  },
  addBlogPost: () => {
    return async (title, content, cb) => {
      await jsonServer.post(`/blogposts`, { title, content });
      cb && cb();
    };
  },
  deleteBlogPost: dispatch => {
    return async id => {
      await jsonServer.delete(`/blogposts/${id}`);
      dispatch({ type: "delete_blogpost", payload: id });
    };
  },
  editBlogPost: dispatch => {
    return async (id, title, content, cb) => {
      await jsonServer.put(`/blogposts/${id}`, { title, content });
      dispatch({ type: "edit_blogpost", payload: { id, title, content } });
      cb && cb();
    };
  }
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  actions,
  defaultState
);
