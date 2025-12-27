import { HelpCircle, Mail, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";



export default function Support() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is iReporter?",
      answer: "iReporter is a platform that allows citizens to report corruption and other issues affecting their communities. You can submit red flag reports for corruption cases or intervention reports for issues requiring government attention."
    },
    {
      question: "How do I create a report?",
      answer: "To create a report, log in to your account, click on 'Create Report' from the dashboard, fill in the required details including title, description, location, and evidence, then submit. You can choose between Red Flag (corruption) or Intervention (other issues) reports."
    },
    {
      question: "What happens after I submit a report?",
      answer: "After submission, your report enters a draft status. It will be reviewed by administrators and may be moved to 'Under Investigation', 'Resolved', or 'Rejected' based on the findings. You'll receive notifications about status updates."
    },
    {
      question: "Can I edit my report after submission?",
      answer: "Yes, you can edit draft reports. Once a report is under investigation, editing may be restricted. Contact support if you need to make changes to an active report."
    },
    {
      question: "How do I know if my report is being investigated?",
      answer: "You can check the status of your reports on your dashboard. Reports under investigation will show 'Under Investigation' status. You'll also receive email notifications about status changes."
    },
    {
      question: "What types of evidence should I include?",
      answer: "Include photos, videos, documents, or any other relevant evidence that supports your report. Make sure evidence is clear and directly related to the issue you're reporting."
    },
    {
      question: "Is my information kept confidential?",
      answer: "Yes, we take privacy seriously. Your personal information is protected, and you can choose to remain anonymous for certain types of reports. However, some contact information may be required for verification purposes."
    },
    {
      question: "How long does it take to resolve a report?",
      answer: "Resolution time varies depending on the complexity of the issue. Simple reports may be resolved within days, while complex corruption cases may take weeks or months to investigate thoroughly."
    }
  ];

  const tips = [
    {
      title: "Be Specific and Detailed",
      description: "Provide clear, detailed descriptions of the incident. Include who, what, when, where, and how the issue occurred. Vague reports are harder to investigate."
    },
    {
      title: "Include Evidence",
      description: "Attach photos, videos, documents, or any other supporting evidence. Visual evidence strengthens your report and helps investigators understand the situation better."
    },
    {
      title: "Use Clear Location Information",
      description: "Provide accurate location details using the map picker or by entering specific addresses. This helps authorities respond to the right location."
    },
    {
      title: "Choose the Right Report Type",
      description: "Select 'Red Flag' for corruption-related issues and 'Intervention' for other government or community problems. This ensures your report reaches the appropriate department."
    },
    {
      title: "Write a Clear Title",
      description: "Use descriptive titles that summarize the main issue. Avoid generic titles like 'Corruption Report' - instead use something like 'Bribery in Government Contract Award Process'."
    },
    {
      title: "Stay Professional",
      description: "Use professional language and avoid emotional outbursts. Stick to facts and let the evidence speak for itself."
    },
    {
      title: "Follow Up",
      description: "Check your dashboard regularly for updates and respond promptly to any requests for additional information from investigators."
    },
    {
      title: "Report Timely",
      description: "Submit reports as soon as possible after the incident occurs while details are still fresh and evidence is available."
    }
  ];

  return (
    <div className="page-dashboard">
      <aside className="page-aside">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <HelpCircle className="text-primary-foreground" size={20} />
          </div>
          <h1 className="sidebar-title">Support Center</h1>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-subtitle">
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </div>
            <h2 className="text-2xl font-semibold">Support Center</h2>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <HelpCircle size={24} style={{ color: "hsl(var(--primary))" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: "100%",
                    padding: "1.25rem",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "hsl(var(--foreground))"
                  }}
                >
                  <span>{faq.question}</span>
                  {expandedFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedFAQ === index && (
                  <div
                    style={{
                      padding: "0 1.25rem 1.25rem 1.25rem",
                      color: "hsl(var(--muted-foreground))",
                      lineHeight: "1.6",
                      borderTop: "1px solid hsl(var(--border))"
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Mail size={24} style={{ color: "hsl(var(--primary))" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
              Contact Admin/Support
            </h3>
          </div>

          <div style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "1rem" }}>
                  Get in Touch
                </h4>
                <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Need help with your account, have questions about a report, or want to provide feedback?
                  Our support team is here to assist you.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Mail size={18} style={{ color: "hsl(var(--primary))" }} />
                    <div>
                      <div style={{ fontWeight: "500", color: "hsl(var(--foreground))" }}>Email Support</div>
                      <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                        support@ireporter.com
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Mail size={18} style={{ color: "hsl(var(--primary))" }} />
                    <div>
                      <div style={{ fontWeight: "500", color: "hsl(var(--foreground))" }}>Admin Contact</div>
                      <div style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                        admin@ireporter.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "1rem" }}>
                  Response Times
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>General inquiries</span>
                    <span style={{ fontWeight: "500", color: "hsl(var(--foreground))" }}>24-48 hours</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>Urgent reports</span>
                    <span style={{ fontWeight: "500", color: "hsl(var(--foreground))" }}>12 hours</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>Technical issues</span>
                    <span style={{ fontWeight: "500", color: "hsl(var(--foreground))" }}>6-12 hours</span>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "hsl(var(--muted))", borderRadius: "0.5rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: 0 }}>
                    <strong>Emergency:</strong> For immediate threats to life or safety, please contact local authorities directly at emergency services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Lightbulb size={24} style={{ color: "hsl(var(--primary))" }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
              Tips for Submitting Good Reports
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {tips.map((tip, index) => (
              <div
                key={index}
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "hsl(var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "0.5rem" }}>
                      {tip.title}
                    </h4>
                    <p style={{ color: "hsl(var(--muted-foreground))", lineHeight: "1.6", margin: 0 }}>
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.75rem",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}>
          <h4 style={{ fontSize: "1.25rem", fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "1rem" }}>
            Still need help?
          </h4>
          <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem", maxWidth: "600px", margin: "0 auto 1.5rem auto" }}>
            Can't find what you're looking for? Our support team is ready to help you with any questions or issues you may have.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsl(var(--primary) / 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsl(var(--primary))";
              }}
            >
              <Mail size={18} />
              Contact Support
            </button>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                background: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsl(var(--muted) / 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsl(var(--muted))";
              }}
            >
              <HelpCircle size={18} />
              Browse FAQ Again
            </button>
          </div>
        </div>
      </main>
    
    </div>
  );
}
