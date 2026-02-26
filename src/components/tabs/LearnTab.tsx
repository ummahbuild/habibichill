const lessons = [
  { id: 1, title: "Understanding Your Anger", duration: "5 min", category: "Foundation", completed: true },
  { id: 2, title: "The Prophet's ﷺ Anger Protocol", duration: "7 min", category: "Sunnah", completed: true },
  { id: 3, title: "The Ego & Arrogance Connection", duration: "8 min", category: "Prevention", completed: false },
  { id: 4, title: "Patience (Sabr) as a Practice", duration: "6 min", category: "Patience", completed: false },
  { id: 5, title: "Forgiveness: The Ultimate Power", duration: "7 min", category: "Forgiveness", completed: false },
  { id: 6, title: "Marriage & Anger Management", duration: "10 min", category: "Relationships", completed: false },
  { id: 7, title: "Controlling Anger While Fasting", duration: "6 min", category: "Ramadan", completed: false },
  { id: 8, title: "Imam Ghazali on Purifying the Heart", duration: "12 min", category: "Advanced", completed: false },
];

const LearnTab = () => {
  return (
    <div className="container mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-2 font-heading text-xl font-bold text-foreground">Daily Training</h1>
      <p className="mb-6 text-sm text-muted-foreground">Prevention through education — address the root causes of anger</p>

      {/* Today's lesson */}
      <div className="mb-6 rounded-2xl bg-gradient-calm border border-border p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Lesson</p>
        <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{lessons[2].title}</h2>
        <p className="mb-3 text-sm text-muted-foreground">{lessons[2].duration} · {lessons[2].category}</p>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 rounded-full bg-primary" />
        </div>
        <button className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-heading font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95">
          Continue Lesson
        </button>
      </div>

      {/* Roadmap */}
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Learning Path</h2>
      <div className="flex flex-col gap-3">
        {lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
              lesson.completed
                ? "border-success/30 bg-success/5"
                : i === 2
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card opacity-60"
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              lesson.completed ? "bg-success text-success-foreground" : i === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {lesson.completed ? "✓" : lesson.id}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{lesson.title}</p>
              <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnTab;
