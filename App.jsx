
import { useEffect, useState } from "react";
import "./index.css";

const SUBJECTS = [
  "Kiểm nghiệm",
  "Ứng dụng sắc kí",
  "Bào chế",
  "Dược lý 2",
  "Dược cổ truyền",
  "Pháp chế",
];

const EXAMS = [
  { date: "2026-12-10", time: "09:00", subject: "Kiểm nghiệm", type: "Tự luận", room: "Chưa cập nhật" },
  { date: "2026-12-15", time: "09:00", subject: "Dược cổ truyền", type: "Trắc nghiệm", room: "Phòng 2B" },
  { date: "2026-12-18", time: "10:15", subject: "Pháp chế", type: "Trắc nghiệm", room: "Phòng 2B" },
  { date: "2026-12-24", time: "14:30", subject: "Ứng dụng sắc kí", type: "Tự luận", room: "Chưa cập nhật" },
  { date: "2026-12-28", time: "13:00", subject: "Bào chế", type: "Trắc nghiệm", room: "Phòng 2B" },
  { date: "2026-12-31", time: "14:30", subject: "Dược lý 2", type: "Tự luận", room: "Chưa cập nhật" },
];

const initialData = {
  links: {},
  study: {},
  grades: [],
  profile: { name: "My Study Room", accent: "#e98cae", avatar: "" },
};

function useSavedData() {
  const [data, setData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pinkStudyRoom") || "{}");
      return {
        ...initialData,
        ...saved,
        profile: { ...initialData.profile, ...(saved.profile || {}) },
      };
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("pinkStudyRoom", JSON.stringify(data));
    } catch {
      alert("Dung lượng lưu trữ đã đầy. M thử chọn ảnh đại diện có dung lượng nhỏ hơn nhé.");
    }
  }, [data]);

  return [data, setData];
}

function App() {
  const [data, setData] = useSavedData();
  const [page, setPage] = useState("Tổng quan");
  const [subject, setSubject] = useState("");
  const [tab, setTab] = useState("Video ghi hình");
  const [selectedDate, setSelectedDate] = useState("2026-12-10");

  const update = (changes) => setData((old) => ({ ...old, ...changes }));

  const openSubject = (name) => {
    setSubject(name);
    setTab("Video ghi hình");
    setPage("Môn học");
  };

  const addLink = (kind, item) => {
    const key = `${subject}::${kind}`;
    update({
      links: {
        ...data.links,
        [key]: [...(data.links[key] || []), { ...item, id: Date.now() }],
      },
    });
  };

  const deleteLink = (kind, id) => {
    const key = `${subject}::${kind}`;
    update({
      links: {
        ...data.links,
        [key]: (data.links[key] || []).filter((item) => item.id !== id),
      },
    });
  };

  const saveStudy = (next) => {
    update({ study: { ...data.study, [subject]: next } });
  };

  return (
    <div className="app-shell" style={{ "--accent": data.profile.accent }}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♡</div>
          <div>
            <h2>Pink Study Room</h2>
            <span>your little study space</span>
          </div>
        </div>

        <div className="side-label">MENU</div>
        {["Tổng quan", "Lịch thi", "Tài liệu", "Bảng điểm", "Góc học tập"].map((item) => (
          <button
            key={item}
            className={`nav-item ${page === item ? "active" : ""}`}
            onClick={() => setPage(item)}
          >
            <span>{({ "Tổng quan": "⌂", "Lịch thi": "▦", "Tài liệu": "▤", "Bảng điểm": "✧", "Góc học tập": "♡" })[item]}</span>
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="tiny-heart">♡</div>
          <p>Small steps every day.</p>
          <span>You're doing great!</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">MY PERSONAL SPACE</span>
            <h1>{page === "Môn học" ? subject : page}</h1>
          </div>
          <div className="top-profile">
            {data.profile.avatar ? (
              <img className="top-avatar" src={data.profile.avatar} alt="Ảnh đại diện" />
            ) : (
              <div className="top-avatar avatar-placeholder">♡</div>
            )}
            <div>
              <b>{data.profile.name || "My Study Room"}</b>
              <small>Pharmacy student</small>
            </div>
          </div>
        </header>

        {page === "Tổng quan" && <Dashboard setPage={setPage} openSubject={openSubject} />}
        {page === "Lịch thi" && <CalendarPage selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {page === "Tài liệu" && <LibraryPage openSubject={openSubject} />}
        {page === "Môn học" && (
          <SubjectPage
            subject={subject}
            tab={tab}
            setTab={setTab}
            links={data.links}
            addLink={addLink}
            deleteLink={deleteLink}
            study={data.study[subject] || { flashcards: [], quiz: [] }}
            saveStudy={saveStudy}
          />
        )}
        {page === "Bảng điểm" && <GradePage grades={data.grades} update={update} />}
        {page === "Góc học tập" && <SettingsPage profile={data.profile} update={update} />}
      </main>
    </div>
  );
}

function Dashboard({ setPage, openSubject }) {
  const upcoming = EXAMS.filter((exam) => exam.date >= "2026-11-18").slice(0, 3);

  return (
    <div className="content">
      <section className="welcome-card">
        <div>
          <span className="eyebrow">A LITTLE PROGRESS IS STILL PROGRESS</span>
          <h2>Chào mừng đến với góc học tập của m! ♡</h2>
          <p>Mỗi ngày học một chút, từng bước tiến gần hơn đến mục tiêu của mình.</p>
          <button className="primary-btn" onClick={() => setPage("Lịch thi")}>Xem lịch thi →</button>
        </div>
        <div className="welcome-flower">🌷</div>
      </section>

      <div className="stats-grid">
        <div className="stat-card"><span>📚</span><small>Môn học năm 4</small><strong>06</strong></div>
        <div className="stat-card"><span>🗓️</span><small>Kỳ thi sắp tới</small><strong>{upcoming.length}</strong></div>
        <div className="stat-card"><span>🎀</span><small>Mục tiêu GPA</small><strong>2.70</strong></div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div><span className="eyebrow">STAY ON TRACK</span><h2>Lịch thi sắp tới</h2></div>
          <button className="text-btn" onClick={() => setPage("Lịch thi")}>Xem tất cả →</button>
        </div>
        <div className="exam-list">
          {upcoming.map((exam) => (
            <div className="exam-row" key={exam.subject}>
              <div className="exam-date"><b>{exam.date.slice(8, 10)}</b><small>THÁNG 12</small></div>
              <div className="exam-info"><b>{exam.subject}</b><small>{exam.time} · {exam.type}</small></div>
              <span className="status-pill">Sắp thi</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR LIBRARY</span><h2>Truy cập nhanh môn học</h2></div>
          <button className="text-btn" onClick={() => setPage("Tài liệu")}>Thư viện →</button>
        </div>
        <div className="subject-grid">
          {SUBJECTS.map((name, i) => (
            <button className="subject-card" key={name} onClick={() => openSubject(name)}>
              <span className="subject-icon">{["🧪", "🔬", "🧴", "💊", "🌿", "📖"][i]}</span>
              <b>{name}</b><small>Mở thư mục môn học →</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function CalendarPage({ selectedDate, setSelectedDate }) {
  const firstDay = new Date(2026, 11, 1).getDay();
  const days = new Date(2027, 0, 0).getDate();
  const examForDate = (day) => EXAMS.find((e) => e.date === `2026-12-${String(day).padStart(2, "0")}`);
  const selectedExam = EXAMS.find((e) => e.date === selectedDate);

  return (
    <div className="content">
      <div className="section-heading"><div><span className="eyebrow">DECEMBER 2026</span><h2>Lịch thi học kỳ ♡</h2></div></div>
      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-month"><button disabled>‹</button><b>Tháng 12 / 2026</b><button disabled>›</button></div>
          <div className="calendar-grid">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => <div className="weekday" key={d}>{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} />)}
            {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
              const date = `2026-12-${String(day).padStart(2, "0")}`;
              const hasExam = !!examForDate(day);
              return (
                <button key={day} className={`calendar-day ${hasExam ? "has-exam" : ""} ${selectedDate === date ? "chosen" : ""}`} onClick={() => setSelectedDate(date)}>
                  {day}{hasExam && <i>♥</i>}
                </button>
              );
            })}
          </div>
          <p className="calendar-note">♥ Ngày có lịch thi</p>
        </section>
        <section className="panel selected-day">
          <span className="eyebrow">SELECTED DATE</span>
          <h2>{selectedDate.split("-").reverse().join("/")}</h2>
          {selectedExam ? (
            <div className="exam-detail">
              <span className="status-pill">Sắp thi</span>
              <h3>{selectedExam.subject}</h3>
              <p>🕘 {selectedExam.time}</p><p>📝 {selectedExam.type}</p><p>📍 {selectedExam.room}</p>
            </div>
          ) : <p className="muted">Chưa có lịch thi vào ngày này.</p>}
          <hr />
          <b>Tất cả lịch thi</b>
          {EXAMS.map((e) => <div className="mini-exam" key={e.subject}><span>{e.date.slice(8, 10)}/12</span>{e.subject}</div>)}
        </section>
      </div>
    </div>
  );
}

function LibraryPage({ openSubject }) {
  return (
    <div className="content">
      <div className="section-heading"><div><span className="eyebrow">MY STUDY MATERIALS</span><h2>Thư viện tài liệu</h2></div></div>
      {[1, 2, 3, 4, 5].map((year) => (
        <section className="year-section" key={year}>
          <h3>Năm {year} <span>{year === 4 ? "06 môn học" : "Chưa có môn học"}</span></h3>
          {year === 4 ? (
            <div className="subject-grid">
              {SUBJECTS.map((s) => <button className="subject-card" key={s} onClick={() => openSubject(s)}><span className="subject-icon">♡</span><b>{s}</b><small>Mở tài liệu →</small></button>)}
            </div>
          ) : <p className="muted">Chưa có tài liệu được thêm vào.</p>}
        </section>
      ))}
    </div>
  );
}

function SubjectPage({ subject, tab, setTab, links, addLink, deleteLink, study, saveStudy }) {
  const tabs = ["Video ghi hình", "Tài liệu ôn thi", "Ôn thi tự động"];
  const kind = tab === "Video ghi hình" ? "videos" : tab === "Tài liệu ôn thi" ? "documents" : "questions";
  const items = links[`${subject}::${kind}`] || [];

  return (
    <div className="content">
      <div className="subject-header">
        <div><span className="eyebrow">YEAR 4 · SUBJECT LIBRARY</span><h2>{subject}</h2><p className="muted">Kho học liệu cá nhân của môn học này.</p></div>
      </div>
      <div className="tabs">
        {tabs.map((t) => <button key={t} className={tab === t ? "tab active-tab" : "tab"} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {tab !== "Ôn thi tự động" ? (
        <LinkManager
          title={tab}
          description={tab === "Video ghi hình" ? "Lưu link bài giảng, video ghi hình và buổi học trực tuyến." : "Lưu link slide, PDF, Word và tài liệu ôn tập."}
          items={items}
          onAdd={(item) => addLink(kind, item)}
          onDelete={(id) => deleteLink(kind, id)}
          placeholder={tab === "Video ghi hình" ? "Ví dụ: Bài giảng chương 1" : "Ví dụ: Đề cương ôn tập"}
        />
      ) : (
        <>
          <LinkManager
            title="Link bộ câu hỏi / tài liệu luyện tập"
            description="Thêm link Google Drive, website hoặc bộ câu hỏi trực tuyến của môn học."
            items={items}
            onAdd={(item) => addLink(kind, item)}
            onDelete={(id) => deleteLink(kind, id)}
            placeholder="Ví dụ: Bộ câu hỏi chương 1"
          />
          <PracticeArea study={study} saveStudy={saveStudy} />
        </>
      )}
    </div>
  );
}

function LinkManager({ title, description, items, onAdd, onDelete, placeholder }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!name.trim() || !cleanUrl) {
      setError("M nhập tên và đường link trước nhé.");
      return;
    }
    if (!/^https?:\/\/\S+/i.test(cleanUrl)) {
      setError("Link cần bắt đầu bằng https:// hoặc http://");
      return;
    }
    onAdd({ name: name.trim(), url: cleanUrl, note: note.trim() });
    setName(""); setUrl(""); setNote(""); setError("");
  };

  return (
    <section className="panel link-panel">
      <div className="section-heading">
        <div><span className="eyebrow">YOUR COLLECTION</span><h2>{title}</h2><p className="muted">{description}</p></div>
        <span className="count-pill">{items.length} link</span>
      </div>
      <form className="link-form" onSubmit={submit}>
        <h3>＋ Thêm link mới</h3>
        <label>Tên tài liệu / video</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholder} />
        <label>Đường link</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        <label>Ghi chú (không bắt buộc)</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: Chương 1, cô gửi ngày 18/11..." />
        {error && <p className="form-error">{error}</p>}
        <button className="primary-btn" type="submit">＋ Thêm vào thư viện</button>
      </form>
      <div className="link-list">
        <h3>Danh sách đã lưu</h3>
        {items.length === 0 ? (
          <div className="empty-state"><span>♡</span><b>Chưa có link nào</b><p>Thêm link đầu tiên của m ở phía trên nhé.</p></div>
        ) : items.map((item) => (
          <div className="saved-link" key={item.id}>
            <div className="file-icon">↗</div>
            <div className="saved-link-info">
              <b>{item.name}</b>
              {item.note && <small>{item.note}</small>}
              <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
            </div>
            <a className="open-link" href={item.url} target="_blank" rel="noreferrer">Mở link ↗</a>
            <button className="delete-btn" type="button" onClick={() => onDelete(item.id)}>×</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PracticeArea({ study, saveStudy }) {
  const [mode, setMode] = useState("flashcards");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [answer, setAnswer] = useState("0");
  const [explanation, setExplanation] = useState("");
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");

  const cards = study.flashcards || [];
  const quiz = study.quiz || [];
  const current = cards[index];

  const addCard = (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    saveStudy({ ...study, flashcards: [...cards, { front: front.trim(), back: back.trim() }] });
    setFront(""); setBack("");
  };

  const addQuestion = (e) => {
    e.preventDefault();
    const options = optionsText.split("\n").map((x) => x.trim()).filter(Boolean);
    if (!question.trim() || options.length < 2) return;
    saveStudy({ ...study, quiz: [...quiz, { question, options, answer: Number(answer), explanation }] });
    setQuestion(""); setOptionsText(""); setExplanation(""); setAnswer("0");
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(importText);
      saveStudy({
        ...study,
        flashcards: [...cards, ...(parsed.flashcards || [])],
        quiz: [...quiz, ...(parsed.quiz || [])],
      });
      setImportText(""); setMessage("Đã nhập bộ câu hỏi thành công!");
    } catch {
      setMessage("JSON chưa đúng định dạng. M kiểm tra lại nhé.");
    }
  };

  const score = quiz.reduce((sum, q, i) => sum + (Number(selected[i]) === Number(q.answer) ? 1 : 0), 0);

  return (
    <section className="panel practice-panel">
      <div className="section-heading"><div><span className="eyebrow">ACTIVE RECALL</span><h2>Ôn thi tự động</h2></div></div>
      <div className="tabs inner-tabs">
        <button className={mode === "flashcards" ? "tab active-tab" : "tab"} onClick={() => setMode("flashcards")}>Flashcards</button>
        <button className={mode === "quiz" ? "tab active-tab" : "tab"} onClick={() => { setMode("quiz"); setShowResult(false); }}>Trắc nghiệm</button>
        <button className={mode === "add" ? "tab active-tab" : "tab"} onClick={() => setMode("add")}>Thêm câu hỏi</button>
        <button className={mode === "import" ? "tab active-tab" : "tab"} onClick={() => setMode("import")}>Nhập JSON</button>
      </div>

      {mode === "flashcards" && (
        <div className="practice-content">
          <h3>Flashcards <span className="count-pill">{cards.length} thẻ</span></h3>
          {current ? (
            <>
              <button className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                <small>{flipped ? "ĐÁP ÁN" : "CÂU HỎI"} · NHẤN ĐỂ LẬT</small>
                <strong>{flipped ? current.back : current.front}</strong>
              </button>
              <div className="card-controls">
                <button className="secondary-btn" onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false); }}>← Trước</button>
                <span>{index + 1} / {cards.length}</span>
                <button className="primary-btn" onClick={() => { setIndex((index + 1) % cards.length); setFlipped(false); }}>Tiếp →</button>
              </div>
            </>
          ) : <div className="empty-state"><span>♡</span><b>Chưa có flashcard</b><p>Vào mục Thêm câu hỏi để tạo thẻ ghi nhớ nhé.</p></div>}
        </div>
      )}

      {mode === "quiz" && (
        <div className="practice-content">
          <h3>Luyện tập trắc nghiệm <span className="count-pill">{quiz.length} câu</span></h3>
          {quiz.length ? quiz.map((q, i) => (
            <div className="quiz-question" key={`${i}-${q.question}`}>
              <b>Câu {i + 1}. {q.question}</b>
              {q.options.map((option, j) => (
                <label className={`quiz-option ${showResult && j === Number(q.answer) ? "correct-option" : ""}`} key={j}>
                  <input type="radio" name={`q-${i}`} checked={Number(selected[i]) === j} onChange={() => setSelected({ ...selected, [i]: j })} disabled={showResult} />
                  {String.fromCharCode(65 + j)}. {option}
                </label>
              ))}
              {showResult && <p className="explanation">Đáp án: {String.fromCharCode(65 + Number(q.answer))}. {q.explanation}</p>}
            </div>
          )) : <p className="muted">Chưa có câu hỏi trắc nghiệm.</p>}
          {quiz.length > 0 && <div className="card-controls">
            {showResult ? <><b>Kết quả: {score}/{quiz.length} câu đúng</b><button className="primary-btn" onClick={() => { setSelected({}); setShowResult(false); }}>Làm lại</button></> :
              <button className="primary-btn" onClick={() => setShowResult(true)}>Nộp bài</button>}
          </div>}
        </div>
      )}

      {mode === "add" && (
        <div className="practice-content">
          <h3>Tạo flashcard</h3>
          <form className="link-form" onSubmit={addCard}>
            <label>Mặt trước – Câu hỏi</label><textarea value={front} onChange={(e) => setFront(e.target.value)} placeholder="Nhập câu hỏi..." />
            <label>Mặt sau – Đáp án</label><textarea value={back} onChange={(e) => setBack(e.target.value)} placeholder="Nhập đáp án..." />
            <button className="primary-btn">＋ Thêm flashcard</button>
          </form>
          <hr />
          <h3>Tạo câu hỏi trắc nghiệm</h3>
          <form className="link-form" onSubmit={addQuestion}>
            <label>Nội dung câu hỏi</label><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Nhập câu hỏi..." />
            <label>Các phương án (mỗi phương án một dòng)</label><textarea value={optionsText} onChange={(e) => setOptionsText(e.target.value)} placeholder={"Phương án A\nPhương án B\nPhương án C\nPhương án D"} />
            <label>Vị trí đáp án đúng (A = 0, B = 1, C = 2, D = 3)</label>
            <input type="number" min="0" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <label>Giải thích</label><textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Giải thích đáp án..." />
            <button className="primary-btn">＋ Thêm câu hỏi</button>
          </form>
        </div>
      )}

      {mode === "import" && (
        <div className="practice-content">
          <h3>Nhập bộ câu hỏi bằng JSON</h3>
          <p className="muted">Dán nội dung JSON theo mẫu. Flashcards và câu hỏi trắc nghiệm sẽ được thêm vào môn học hiện tại.</p>
          <textarea className="json-input" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={'{\n  "flashcards": [{"front": "Câu hỏi", "back": "Đáp án"}],\n  "quiz": [{"question": "Câu hỏi?", "options": ["A", "B", "C", "D"], "answer": 0, "explanation": "Giải thích"}]\n}'} />
          <button className="primary-btn" onClick={importJson}>Nhập dữ liệu</button>
          {message && <p className="form-success">{message}</p>}
        </div>
      )}
    </section>
  );
}

function GradePage({ grades, update }) {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [grade, setGrade] = useState("");
  const totalCredits = grades.reduce((s, g) => s + Number(g.credits), 0);
  const gpa = totalCredits ? grades.reduce((s, g) => s + Number(g.credits) * Number(g.grade), 0) / totalCredits : 0;

  const add = (e) => {
    e.preventDefault();
    if (!name.trim() || !credits || grade === "") return;
    update({ grades: [...grades, { id: Date.now(), name: name.trim(), credits: Number(credits), grade: Number(grade) }] });
    setName(""); setCredits(""); setGrade("");
  };

  return (
    <div className="content">
      <div className="section-heading"><div><span className="eyebrow">ACADEMIC TRACKER</span><h2>Bảng điểm của m</h2></div></div>
      <div className="gpa-card"><span>GPA tích lũy theo dữ liệu đã nhập</span><strong>{gpa.toFixed(2)}</strong><p>Mục tiêu GPA: 2.70</p><div className="gpa-track"><i style={{ width: `${Math.min(gpa / 4 * 100, 100)}%` }} /></div></div>
      <section className="panel">
        <h3>＋ Thêm học phần</h3>
        <form className="grade-form" onSubmit={add}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên học phần" />
          <input type="number" min="1" value={credits} onChange={(e) => setCredits(e.target.value)} placeholder="Số tín chỉ" />
          <input type="number" min="0" max="4" step="0.1" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Điểm hệ 4" />
          <button className="primary-btn">Thêm</button>
        </form>
        <div className="grade-list">
          {grades.map((g) => <div className="grade-row" key={g.id}><b>{g.name}</b><span>{g.credits} tín chỉ</span><strong>{Number(g.grade).toFixed(1)}</strong><button className="delete-btn" onClick={() => update({ grades: grades.filter((x) => x.id !== g.id) })}>×</button></div>)}
          {!grades.length && <p className="muted">Chưa có học phần nào được nhập.</p>}
        </div>
        <p className="fine-print">GPA được tính theo trung bình có trọng số tín chỉ trên các học phần đã nhập. Kết quả chính thức có thể khác theo quy chế của trường.</p>
      </section>
    </div>
  );
}

function SettingsPage({ profile, update }) {
  const [avatarError, setAvatarError] = useState("");

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("M chọn file ảnh JPG, PNG hoặc WEBP nhé.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Ảnh hơi nặng rồi m ơi. Chọn ảnh dưới 2MB nhé.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update({ profile: { ...profile, avatar: reader.result } });
      setAvatarError("");
    };
    reader.onerror = () => setAvatarError("Không đọc được ảnh. M thử chọn ảnh khác nhé.");
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    update({ profile: { ...profile, avatar: "" } });
    setAvatarError("");
  };

  return (
    <div className="content">
      <div className="section-heading">
        <div><span className="eyebrow">MAKE IT YOURS</span><h2>Góc học tập của m</h2></div>
      </div>

      <section className="panel settings-panel">
        <div className="avatar-settings">
          <div className="avatar-preview-wrap">
            {profile.avatar ? (
              <img className="avatar-preview" src={profile.avatar} alt="Ảnh đại diện hiện tại" />
            ) : (
              <div className="avatar-preview avatar-placeholder-large">♡</div>
            )}
          </div>
          <div className="avatar-controls">
            <h3>Ảnh đại diện</h3>
            <p className="muted">Chọn một tấm ảnh từ máy tính để làm avatar cho Pink Study Room.</p>
            <label className="primary-btn upload-btn" htmlFor="avatar-upload">＋ Chọn ảnh từ máy</label>
            <input
              id="avatar-upload"
              className="file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatar}
            />
            {profile.avatar && <button className="remove-avatar-btn" type="button" onClick={removeAvatar}>Xóa ảnh đại diện</button>}
            {avatarError && <p className="form-error">{avatarError}</p>}
            <small className="avatar-hint">Hỗ trợ JPG, PNG, WEBP · Tối đa 2MB</small>
          </div>
        </div>

        <hr />
        <label>Tên hiển thị</label>
        <input value={profile.name || ""} onChange={(e) => update({ profile: { ...profile, name: e.target.value } })} />

        <label>Màu chủ đạo</label>
        <div className="color-options">
          {["#e98cae", "#d98bb9", "#b88acb", "#e5a08f", "#df789e"].map((color) => (
            <button key={color} className={`color-dot ${profile.accent === color ? "selected-color" : ""}`} style={{ background: color }} onClick={() => update({ profile: { ...profile, accent: color } })} />
          ))}
        </div>
        <p className="muted">Ảnh đại diện, tên và màu sắc được lưu trên trình duyệt này.</p>
      </section>
    </div>
  );
}

export default App;
