interface AlertProps {
  type: 'success' | 'error' | null;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!type) return null;

  return (
    <div
      className={`alert ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white p-4 mb-4`}
    >
      {message}
    </div>
  );
};

export default Alert;
