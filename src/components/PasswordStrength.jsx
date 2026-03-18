import { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  if (!strength) return null;

  const getColor = (score) => {
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
    return colors[score];
  };

  const getLabel = (score) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[score];
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((strength.score + 1) / 5) * 100}%`,
              backgroundColor: getColor(strength.score),
            }}
          />
        </div>
        <span className="text-sm font-medium" style={{ color: getColor(strength.score) }}>
          {getLabel(strength.score)}
        </span>
      </div>
      
      {strength.feedback.warning && (
        <p className="text-sm text-orange-600 mt-1">
          {strength.feedback.warning}
        </p>
      )}
      
      {strength.feedback.suggestions.length > 0 && (
        <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
          {strength.feedback.suggestions.map((suggestion, i) => (
            <li key={i}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
