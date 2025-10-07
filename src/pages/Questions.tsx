{/* Question */}
{currentQuestion && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "1rem",
      backgroundColor: "white",
      borderRadius: "6px",
      border: "1px solid #ccc",
      minHeight: "60vh", // scale with viewport
      maxHeight: "80vh",
      overflow: "hidden"
    }}
  >
    <div style={{ flex: "0 0 auto" }}>
      <p style={{ fontSize: "1.1rem" }}><strong>Q: </strong>{currentQuestion.question}</p>
    </div>

    <div style={{ flex: "1 1 auto", overflowY: "auto", marginTop: "0.5rem" }}>
      {currentQuestion.choices.map((choice, idx) => {
        let bg = "white";
        let border = "#ccc";
        if (isAnswered) {
          if (choice === currentQuestion.answer) {
            bg = "#d4edda"; border = "#28a745";
          } else if (choice === currentAnswer) {
            bg = "#f8d7da"; border = "#dc3545";
          }
        }

        return (
          <div
            key={idx}
            onClick={() => handleChoiceSelect(choice)}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: `2px solid ${border}`,
              borderRadius: "6px",
              backgroundColor: bg,
              cursor: isAnswered ? "default" : "pointer",
              transition: "all 0.2s"
            }}
          >
            <input
              type="radio"
              checked={currentAnswer === choice}
              readOnly
              style={{ marginRight: "0.5rem" }}
            />
            {choice}
            {isAnswered && choice === currentQuestion.answer && " ✓"}
            {isAnswered && choice === currentAnswer && choice !== currentQuestion.answer && " ✗"}
          </div>
        );
      })}
    </div>

    {isAnswered && currentQuestion.explanation && (
      <p
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#fff3cd",
          padding: "0.5rem",
          borderRadius: "4px",
          flex: "0 0 auto"
        }}
      >
        <strong>Explanation:</strong> {currentQuestion.explanation}
      </p>
    )}

    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flex: "0 0 auto" }}>
      <button
        onClick={handleExitSession}
        style={{
          padding: "0.5rem 1.5rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Exit Session
      </button>
      {isAnswered && (
        <button
          onClick={handleNext}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {currentIndex + 1 >= questions.length ? "Finish Session" : "Next Question"}
        </button>
      )}
    </div>
  </div>
)}

