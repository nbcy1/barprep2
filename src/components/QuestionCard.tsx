import { useState } from "react";

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

interface Props {
  question: Question;
  onNext: () => void;
}

export default function QuestionCard({ question, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="card">
      <h3>{question.text}</h3>
      {question.options.map((opt, idx) => (
        <label key={idx}>
          <input
            type="radio"
            name="answer"
            value={idx}
            checked={selected === idx}
            onChange={() => setSelected(idx)}
          />
          {opt}
        </label>
      ))}
      <button onClick={onNext} disabled={selected === null}>
        Next
      </button>
    </div>
  );
}
