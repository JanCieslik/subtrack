export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`spinner-wrap${fullPage ? ' fullpage' : ''}`}>
      <div className="spinner" />
    </div>
  );
}
