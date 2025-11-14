"use client";

import { Card } from "@/components/ui/Card";

export function CourseCard({ code, title, description, onClick }) {
  return (
    <Card
      className="p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
      onClick={onClick}
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="space-y-2">
        <h3
          className="text-base sm:text-lg font-medium truncate"
          style={{ color: "var(--text-color-light)" }}
          title={code}
        >
          {code}
        </h3>
        <p
          className="text-xs sm:text-sm leading-relaxed line-clamp-2"
          style={{ color: "var(--text-color-light)" }}
          title={description}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}
