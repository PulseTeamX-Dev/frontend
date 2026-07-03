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
import Icon from "@/shared/ui/Icon";
import { resolveAlert } from "../redux/alerts/operation";
import { toast } from "react-toastify";
import { PageHeader } from "../shared/PageHeader"; // 🔒 Наш шеред-компонент
import { PageLoader } from "../shared/Loader";

export const CommentsPage = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: "new", label: "Нові" },
    { value: "all", label: "Всі" },
  ] as const;

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

  const handleResolve = async (alertId: number) => {
    try {
      await dispatch(resolveAlert(alertId)).unwrap();

      // оновлюємо список алертів
      dispatch(fetchAlerts());

      toast.success("Сигнал позначено як вирішений");
    } catch {
      toast.error("Не вдалося закрити сигнал");
    }
  };

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
        <div className="rounded-3xl border border-[#EEEEEE] bg-white p-5 shadow-sm">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <div className="h-1 w-1 rounded-full bg-[#ED2B26]" />
                <span className="text-xs font-semibold leading-4 text-[#191219]">
                  {newCommentsCount} нових
                </span>
              </div>

              <div className="rounded-xl border border-[#CCCCCC] bg-white px-3 py-2">
                <span className="text-xs font-semibold leading-4 text-[#666666]">
                  {pagination?.total_comments ?? 0} коментарів
                </span>
              </div>
            </div>

            <div className="relative w-[150px]">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`group flex h-11 w-full items-center justify-between border border-[#EEEEEE] px-4 transition-colors
    ${
      isFilterOpen
        ? "rounded-t-xl rounded-b-none bg-[#F97316] text-white"
        : "rounded-xl bg-white text-[#222222]"
    }`}
              >
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isFilterOpen
                      ? "text-white"
                      : "text-[#222222] group-hover:text-[#F97316]"
                  }`}
                >
                  {filterOptions.find((item) => item.value === filter)?.label}
                </span>

                <svg
                  className={`h-4 w-4 transition-all ${
                    isFilterOpen
                      ? "rotate-180 text-white"
                      : "text-[#666666] group-hover:text-[#F97316]"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 right-0 z-20 overflow-hidden rounded-b-xl border border-t-0 border-[#EEEEEE] bg-white shadow-lg">
                  {filterOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilter(option.value);
                        setPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-[#FAFAFA]
            ${
              filter === option.value
                ? "font-semibold text-[#222222]"
                : "font-normal text-[#666666]"
            }
            ${
              index !== filterOptions.length - 1
                ? "border-b border-[#EEEEEE]"
                : ""
            }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
        onResolve={handleResolve}
      />
    </>
  );
};

export default CommentsPage;
