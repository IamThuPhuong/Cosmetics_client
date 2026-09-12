"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { UserResponse, UserFilterParams, Role, UserStatus } from "@/types/auth";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: UserFilterParams = {
        page: currentPage,
        size: 15,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (statusFilter && statusFilter !== "ALL") params.status = statusFilter as UserStatus;
      if (roleFilter && roleFilter !== "ALL") params.role = roleFilter as Role;

      const res = await adminService.getAdminUsers(params);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, statusFilter, roleFilter, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleUserStatus = async (user: UserResponse) => {
    const newStatus: UserStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const confirmMsg =
      newStatus === "LOCKED"
        ? `Bạn có chắc muốn KHÓA tài khoản "${user.username}"?`
        : `Mở khóa cho tài khoản "${user.username}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      setTogglingId(user.id);
      await adminService.updateUserStatus(user.id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err: any) {
      alert(err?.message || "Không thể cập nhật trạng thái người dùng.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Quản lý Tài khoản &amp; Người dùng
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Danh sách khách hàng thành viên, chuyên viên CSKH và quản trị viên hệ thống
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Tìm theo username, họ tên, email, sđt..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả vai trò (Role)</option>
          <option value="ROLE_USER">Khách hàng (ROLE_USER)</option>
          <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
          <option value="ROLE_CSKH">Tư vấn viên (ROLE_CSKH)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
          <option value="LOCKED">Bị khóa (LOCKED)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">Đang tải danh sách tài khoản...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Không tìm thấy tài khoản người dùng nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Tài khoản</th>
                  <th className="py-3.5 px-4">Thông tin liên hệ</th>
                  <th className="py-3.5 px-4">Loại da</th>
                  <th className="py-3.5 px-4">Vai trò (Role)</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4">Ngày tham gia</th>
                  <th className="py-3.5 px-4 text-right">Khóa / Mở</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => {
                  const isAdminRole = u.roleName === "ROLE_ADMIN";
                  const isLocked = u.status === "LOCKED";

                  return (
                    <tr key={u.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{u.fullName || u.username}</div>
                        <div className="text-[11px] text-rose-600 font-medium">@{u.username}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-stone-700">{u.email || "---"}</div>
                        <div className="text-[11px] text-stone-400">{u.phone || "---"}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                          {u.skinType || "Chưa chọn"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isAdminRole
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isAdminRole ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {u.roleName || "ROLE_USER"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isLocked
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isLocked ? "Bị khóa" : "Hoạt động"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-stone-400 whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          disabled={togglingId === u.id || isAdminRole}
                          onClick={() => handleToggleUserStatus(u)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 ${
                            isLocked
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-600"
                          }`}
                          title={isAdminRole ? "Không thể khóa tài khoản Admin" : undefined}
                        >
                          {togglingId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isLocked ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              Mở khóa
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              Khóa
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-stone-200 font-bold disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 font-bold disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
