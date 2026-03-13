export const formatRelativeTime = (value) => {
  if (!value) return "";

  const now = new Date();
  const target = new Date(value);
  const diffMs = now - target;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return target.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: target.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatMemberSince = (value) => {
  if (!value) return "Recently joined";

  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

export const getInitials = (firstName = "", lastName = "") => {
  return `${firstName[0] || ""}${lastName[0] || ""}`.trim().toUpperCase() || "PV";
};

export const humanizeExperience = (value = "") => {
  if (!value) return "Experience not added";

  return value.charAt(0).toUpperCase() + value.slice(1);
};
