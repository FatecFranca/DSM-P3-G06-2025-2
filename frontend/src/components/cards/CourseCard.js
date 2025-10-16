import { Card } from "@/components/ui/Card";

export function CourseCard({ code, title, description, onClick }) {
  return (
    <Card 
      className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
      onClick={onClick}
      style={{ backgroundColor: 'var(--primary-color)' }}
    >
      <div className="space-y-2">
        <h3 
          className="text-lg font-medium"
          style={{ color: 'var(--text-color-light)' }}
        >
          {code}
        </h3>
        <p 
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-color-light)' }}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}
