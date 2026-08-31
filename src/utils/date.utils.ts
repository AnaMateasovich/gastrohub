export type DateFilter = Date | { from: Date; to: Date };

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function resolveDateRange(filter?: DateFilter): {
  start: Date;
  end: Date;
} {
  if (!filter) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    return { start, end };
  }

  if ("from" in filter && "to" in filter) {
    const start = new Date(filter.from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(filter.to);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  const start = new Date(filter);
  start.setHours(0, 0, 0, 0);

  const end = new Date(filter);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
