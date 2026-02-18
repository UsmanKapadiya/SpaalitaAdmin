import { Update } from "@mui/icons-material";
import requests from "./api";

const OrderService = {
  getOrderList: async (token, page, limit, searchTerm, statusFilter) => {
    let url = `/orders?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (params.length) url += `&${params.join('&')}`;
    return requests.get(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  UpdateOrder: async (token, body, id) => {
    return requests.put(`/orders/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
   DeleteOrder: async (token, id) => {
    return requests.delete(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
export default OrderService