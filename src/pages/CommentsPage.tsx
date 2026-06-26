import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import {
  selectComments,
  selectCommentsLoading,
  selectCommentsPagination,
} from "../redux/comments/selectors";
import {
  selectAlerts,
  selectUnresolvedAlertsCount,
} from "../redux/alerts/selectors";
import { fetchComments } from "../redux/comments/operation";
import { fetchAlerts } from "../redux/alerts/operation";
import CommentCard from "../components/comments/CommentCard";
import AlertsModal from "../components/alerts/AlertsModal";
import Pagination from "../components/comments/Pagination";
import Icon from "../shared/Icon";
import { PageHeader } from "../shared/PageHeader"; // 🔒 Наш шеред-компонент
import { PageLoader } from "../shared/Loader";

export const CommentsPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const comments = useAppSelector(selectComments);
  const pagination = useAppSelector(selectCommentsPagination);
  const loading = useAppSelector(selectCommentsLoading);
  const alerts = useAppSelector(selectAlerts);
  const unresolvedCount = useAppSelector(selectUnresolvedAlertsCount);

  useEffect(() => {
    dispatch(fetchComments({ page, limit: filter === "new" ? 3 : 10 }));
    dispatch(fetchAlerts());
  }, [dispatch, page, filter]);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const newComments = comments
    .toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3);

  const displayedComments = filter === "new" ? newComments : comments;
  const newCommentsCount = newComments.length;

  return (
    <>
      <div className="mx-auto p-4 md:p-6">
        <PageHeader
          title="Коментарі"
          showLogo={true}
          rightContent={
            <button
              type="button"
              onClick={() => setIsAlertsOpen(true)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon id="bell" className="w-5 h-5 text-grayscale-700" />
              {unresolvedCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
              )}
            </button>
          }
        />

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium">
                {newCommentsCount} нових
              </div>

              <div className="px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">
                {pagination?.total_comments ?? 0} коментарів
              </div>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "new")}
              className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary-active"
            >
              <option value="new">Нові</option>
              <option value="all">Всі</option>
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <PageLoader />
          ) : displayedComments.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Коментарів поки немає
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedComments.map((comment) => (
                <CommentCard key={comment.response_id} comment={comment} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filter === "all" && pagination && pagination.total_pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={pagination.total_pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
      />
    </>
  );
};

export default CommentsPage;
