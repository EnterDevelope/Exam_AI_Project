type Props = {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
};

export default function ErrorBanner({ message, onRetry, onClose }: Props) {
  return (
    <div className="bg-red-100 text-red-800 p-4 rounded flex items-center justify-between gap-2">
      <div>{message}</div>
      <div className="flex gap-2">
        {onRetry && (
          <button onClick={onRetry} className="mt-2 btn-primary">
            다시 시도
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="mt-2 btn-secondary" aria-label="닫기">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
