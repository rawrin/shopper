import React from 'react';

export default function Apply({onApply}) {
  return (
    <div className="shopper__box-apply">
      <h1>Work at Instacart</h1>
      <p>Apply in under 5 minutes</p>

      <input
        placeholder="Email"
        type="email"
        required
      />
      <button onClick={onApply}>Apply Now!</button>
    </div>
  );
}
