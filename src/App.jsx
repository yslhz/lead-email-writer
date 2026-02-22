import { useState } from "react";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function App() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    industry: "",
    pain: "",
    yourProduct: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateEmail = async () => {
    if (!form.name || !form.company || !form.role) {
      setError("Please fill in at least Name, Company, and Role.");
      return;
    }
    setError("");
    setLoading(true);
    setEmail("");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: "You are an expert cold email copywriter. Write short, personalized, high-converting cold emails. Max 5 sentences. Sound human, not salesy. Reference something specific about their company or role. End with a soft CTA like Worth a quick chat. Format: Subject: your subject line, then a blank line, then the email body.",
            },
            {
              role: "user",
              content:
                "Lead Info:\n- Name: " + form.name +
                "\n- Company: " + form.company +
                "\n- Role: " + form.role +
                "\n- Industry: " + (form.industry || "Unknown") +
                "\n- Their likely pain point: " + (form.pain || "scaling efficiently") +
                "\n- My product/service: " + (form.yourProduct || "an AI automation tool that saves time") +
                "\n\nWrite the cold email now.",
            },
          ],
        }),
      });
      const data = await res.json();
      const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
      if (!text) {
        setError("Error: " + JSON.stringify(data));
      }
      setEmail(text);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { name: "name", label: "Lead's Name", placeholder: "e.g. Sarah Johnson", required: true },
    { name: "company", label: "Company", placeholder: "e.g. Acme Inc.", required: true },
    { name: "role", label: "Their Role / Title", placeholder: "e.g. Head of Marketing", required: true },
    { name: "industry", label: "Industry", placeholder: "e.g. SaaS, Real Estate" },
    { name: "pain", label: "Their Pain Point", placeholder: "e.g. too much time on manual outreach" },
    { name: "yourProduct", label: "Your Product / Service", placeholder: "e.g. AI lead generation tool" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "Georgia, serif", color: "#e8e0d0", padding: "0" }}>
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "28px 40px", display: "flex", alignItems: "center", gap: "14px", background: "#0d0d15" }}>
        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #c8a96e, #e8c98a)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          ✉
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: "bold", letterSpacing: "0.02em", color: "#f0e8d8" }}>LeadMailAI</div>
          <div style={{ fontSize: 12, color: "#6b6570", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cold Email Generator</div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ marginBottom: 42 }}>
          <h1 style={{ fontSize: 38, fontWeight: "normal", margin: "0 0 12px", color: "#f0e8d8", lineHeight: 1.2 }}>
            Write a cold email
            <br />
            <span style={{ color: "#c8a96e" }}>that actually gets replies.</span>
          </h1>
          <p style={{ color: "#6b6570", fontSize: 15, margin: 0 }}>Fill in the lead details — AI does the rest in seconds.</p>
        </div>

        <div style={{ background: "#0f0f1a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "36px", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {fields.map((f) => (
              <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 12, color: "#9a9098", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {f.label}
                  {f.required && <span style={{ color: "#c8a96e" }}> *</span>}
                </label>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={{ background: "#13131f", border: "1px solid #252535", borderRadius: 8, padding: "11px 14px", color: "#e8e0d0", fontSize: 14, fontFamily: "Georgia, serif", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#c8a96e")}
                  onBlur={(e) => (e.target.style.borderColor = "#252535")}
                />
              </div>
            ))}
          </div>

          {error && <div style={{ marginTop: 16, color: "#e07070", fontSize: 13 }}>{error}</div>}

          <button
            onClick={generateEmail}
            disabled={loading}
            style={{ marginTop: 28, width: "100%", padding: "15px", background: loading ? "#2a2520" : "linear-gradient(135deg, #c8a96e, #b8904a)", border: "none", borderRadius: 10, color: loading ? "#6b6570" : "#0a0a0f", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Generating your email..." : "Generate Cold Email"}
          </button>
        </div>

        {email && (
          <div style={{ background: "#0f0f1a", border: "1px solid #2a2a1e", borderRadius: 16, padding: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#c8a96e", letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Email</div>
              <button
                onClick={copyEmail}
                style={{ background: copied ? "#1e2e1e" : "#13131f", border: "1px solid " + (copied ? "#4a8a4a" : "#252535"), borderRadius: 7, padding: "7px 16px", color: copied ? "#7ac87a" : "#9a9098", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.75, color: "#d8d0c0", margin: 0 }}>{email}</pre>
            <button
              onClick={generateEmail}
              style={{ marginTop: 24, background: "transparent", border: "1px solid #252535", borderRadius: 8, padding: "9px 20px", color: "#6b6570", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}