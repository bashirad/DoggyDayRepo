export interface LoadingSpinnerProps {
  loadingText?: string;
}

const LoadingSpinner = ({ loadingText }: LoadingSpinnerProps) => {
  return (
    <div>
      <div className="row mt-4 mb-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      {loadingText && (
        <div className="row mt-4 mb-4">
          <div className="d-flex justify-content-center">{loadingText}</div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
