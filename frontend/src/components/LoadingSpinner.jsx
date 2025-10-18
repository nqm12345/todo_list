import "./LoadingSpinner.css";

export default function LoadingSpinner({ size = "medium", fullPage = false }) {
  const sizeClass = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large"
  }[size] || "spinner-medium";

  const spinner = (
    <div className={`loading-spinner ${sizeClass}`}>
      <div className="spinner-ring"></div>
      <p className="spinner-text">Đang tải...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
}
