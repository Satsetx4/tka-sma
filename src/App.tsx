import { useEffect, useState } from "react";
import { QUESTIONS } from "./data/questions";
import {
  SUBJECT_IDS, scoreOf, shuffled, store, uid,
  type Attempt, type ExamMode, type Question, type SubjectId,
} from "./lib/store";
import { HomeScreen } from "./screens/Home";
import { SetupScreen } from "./screens/Setup";
import { ExamScreen } from "./screens/Exam";
import { ResultScreen } from "./screens/Result";
import { HistoryScreen } from "./screens/History";

type Screen =
  | { name: "home" }
  | { name: "setup"; mode: ExamMode; userName: string }
  | { name: "exam"; mode: ExamMode; userName: string; questions: Question[] }
  | { name: "result"; attempt: Attempt; questions: Question[]; answers: (number | null)[]; retry: { mode: ExamMode; userName: string } }
  | { name: "history" };

function bySubjects(ids: SubjectId[]): Question[] {
  const pool = QUESTIONS.filter((q) => ids.includes(q.subject));
  return shuffled(pool);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", store.theme.load() === "dark");
  }, []);

  const goHome = () => setScreen({ name: "home" });

  if (screen.name === "home") {
    return (
      <HomeScreen
        onStart={(mode, name) => setScreen({ name: "setup", mode, userName: name })}
        onHistory={() => setScreen({ name: "history" })}
        onHome={goHome}
      />
    );
  }

  if (screen.name === "history") {
    return <HistoryScreen onHome={goHome} onHistory={() => setScreen({ name: "history" })} />;
  }

  if (screen.name === "setup") {
    return (
      <SetupScreen
        mode={screen.mode} name={screen.userName}
        onBack={goHome}
        onBegin={(subjects) =>
          setScreen({ name: "exam", mode: screen.mode, userName: screen.userName, questions: bySubjects(subjects) })
        }
      />
    );
  }

  if (screen.name === "exam") {
    return (
      <ExamScreen
        questions={screen.questions} mode={screen.mode} name={screen.userName}
        onExit={goHome}
        onFinish={(answers, _flagged, elapsedSec) => {
          const correct = screen.questions.filter((q, i) => answers[i] === q.answer).length;
          const perSubject: Attempt["perSubject"] = {};
          for (const sid of SUBJECT_IDS) {
            const qs = screen.questions.filter((q) => q.subject === sid);
            if (!qs.length) continue;
            perSubject[sid] = {
              total: qs.length,
              correct: qs.filter((q) => answers[screen.questions.indexOf(q)] === q.answer).length,
            };
          }
          const attempt: Attempt = {
            id: uid(),
            date: new Date().toISOString(),
            name: screen.userName,
            mode: screen.mode,
            subjects: [...new Set(screen.questions.map((q) => q.subject))],
            total: screen.questions.length,
            correct,
            score: scoreOf(correct, screen.questions.length),
            durationSec: elapsedSec,
            perSubject,
          };
          store.attempts.add(attempt);
          setScreen({
            name: "result", attempt,
            questions: screen.questions, answers,
            retry: { mode: screen.mode, userName: screen.userName },
          });
        }}
      />
    );
  }

  return (
    <ResultScreen
      attempt={screen.attempt} questions={screen.questions} answers={screen.answers}
      onHome={goHome}
      onRetry={() =>
        setScreen({ name: "exam", mode: screen.retry.mode, userName: screen.retry.userName, questions: bySubjects(screen.attempt.subjects) })
      }
    />
  );
}
